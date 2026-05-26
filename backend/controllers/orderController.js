// backend/controllers/orderController.js
const db = require('../models/db');

const orderController = {
    // CREAR UN NUEVO PEDIDO
    createOrder: async (req, res) => {
        const idClient = req.user.id; 
        let { items } = req.body; 

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío." });
        }

        // SOLUCION Agrupar productos duplicados y sumar cantidades
        const groupedItemsMap = new Map();
        
        for (let item of items) {
            if (groupedItemsMap.has(item.idProduct)) {
                const existingItem = groupedItemsMap.get(item.idProduct);
                existingItem.quantity += item.quantity; 
            } else {
                groupedItemsMap.set(item.idProduct, { ...item }); 
            }
        }
        
        const cleanItems = Array.from(groupedItemsMap.values());

        const connection = await db.getConnection(); 
        await connection.beginTransaction();

        try {
            let total = 0;
            
            for (let item of cleanItems) {
                const [product] = await connection.query('SELECT price, stock FROM products WHERE idProduct = ?', [item.idProduct]);
                
                if (product.length === 0) throw new Error(`Producto ${item.idProduct} no encontrado.`);
                if (product[0].stock < item.quantity) throw new Error(`Stock insuficiente para el producto ${item.idProduct}.`);

                item.price = product[0].price;
                total += item.price * item.quantity;
            }

            const [orderResult] = await connection.query(
                'INSERT INTO orders (idClient, total) VALUES (?, ?)', 
                [idClient, total]
            );
            const newOrderId = orderResult.insertId;

            for (let item of cleanItems) {
                await connection.query(
                    'INSERT INTO orderDetails (orderId, idProduct, quantityOrdered, priceEach) VALUES (?, ?, ?, ?)',
                    [newOrderId, item.idProduct, item.quantity, item.price]
                );

                await connection.query(
                    'UPDATE products SET stock = stock - ? WHERE idProduct = ?',
                    [item.quantity, item.idProduct]
                );
            }

            await connection.commit();
            res.status(201).json({ message: "Pedido creado exitosamente", orderId: newOrderId });

        } catch (error) {
            await connection.rollback();
            console.error("Error transaccional en createOrder:", error); 
            res.status(400).json({ message: error.message });
        } finally {
            connection.release(); 
        }
    },

    // RECUPERAR PEDIDOS DEL CLIENTE
    getMyOrders: async (req, res) => {
        try {
            const idClient = req.user.id; 

            const [orders] = await db.query('SELECT * FROM orders WHERE idClient = ? ORDER BY date DESC', [idClient]);

            if (orders.length === 0) {
                return res.json([]);
            }

            for (let order of orders) {
                const detailsQuery = `
                    SELECT od.quantityOrdered, od.priceEach, p.name 
                    FROM orderDetails od
                    JOIN products p ON od.idProduct = p.idProduct
                    WHERE od.orderId = ?
                `;
                const [items] = await db.query(detailsQuery, [order.orderId]);
                order.items = items; 
            }

            res.json(orders);
        } catch (error) {
            console.error("Error obteniendo pedidos:", error);
            res.status(500).json({ message: "Error al recuperar el historial." });
        }
    }
};

module.exports = orderController;