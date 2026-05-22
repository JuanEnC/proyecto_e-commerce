// backend/controllers/orderController.js
const db = require('../models/db');

const orderController = {
    // CREAR UN NUEVO PEDIDO
    createOrder: async (req, res) => {
        // Extraemos el idClient del token (que será inyectado por el middleware de seguridad más adelante)
        const idClient = req.user.id; 
        const { total, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío." });
        }

        // Obtener una conexión dedicada para la transacción
        const connection = await db.getConnection();

        try {
            // Iniciar transacción
            await connection.beginTransaction();

            // 1. Insertar el pedido en 'orders'
            const orderQuery = 'INSERT INTO orders (idClient, total, status) VALUES (?, ?, ?)';
            const [orderResult] = await connection.query(orderQuery, [idClient, total, 'PENDING']);
            const newOrderId = orderResult.insertId;

            // 2. Insertar cada producto en 'orderDetails'
            const detailsQuery = 'INSERT INTO orderDetails (orderId, idProduct, quantityOrdered, priceEach) VALUES (?, ?, ?, ?)';
            
            for (let item of items) {
                await connection.query(detailsQuery, [newOrderId, item.idProduct, item.quantity, item.priceEach]);
                
                // 3. (Opcional) Restar el stock del producto
                await connection.query('UPDATE products SET stock = stock - ? WHERE idProduct = ?', [item.quantity, item.idProduct]);
            }

            // Confirmar transacción (Guardar todo de forma permanente)
            await connection.commit();
            res.status(201).json({ message: "Pedido realizado con éxito.", orderId: newOrderId });

        } catch (error) {
            // Si algo falla, deshacemos todos los cambios en la base de datos
            await connection.rollback();
            console.error("Error al crear pedido:", error);
            res.status(500).json({ message: "Error al procesar el pedido." });
        } finally {
            // Liberar la conexión
            connection.release();
        }
    },

    // RECUPERAR PEDIDOS DEL CLIENTE
    getMyOrders: async (req, res) => {
        try {
            const idClient = req.user.id; // Extraído del token

            // 1. Obtener los pedidos principales
            const [orders] = await db.query('SELECT * FROM orders WHERE idClient = ? ORDER BY date DESC', [idClient]);

            if (orders.length === 0) {
                return res.json([]);
            }

            // 2. Para cada pedido, obtener sus detalles (qué productos compró)
            // Se hace un JOIN con products para devolver el nombre del producto al frontend
            for (let order of orders) {
                const detailsQuery = `
                    SELECT od.quantityOrdered, od.priceEach, p.name 
                    FROM orderDetails od
                    JOIN products p ON od.idProduct = p.idProduct
                    WHERE od.orderId = ?
                `;
                const [items] = await db.query(detailsQuery, [order.orderId]);
                order.items = items; // Adjuntamos el arreglo al objeto de la orden
            }

            res.json(orders);
        } catch (error) {
            console.error("Error obteniendo pedidos:", error);
            res.status(500).json({ message: "Error al recuperar el historial." });
        }
    }
};

module.exports = orderController;