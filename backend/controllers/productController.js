// backend/controllers/productController.js
const db = require('../models/db');

const productController = {
    // RECUPERAR TODOS LOS PRODUCTOS (Para clientes y admins)
    getAllProducts: async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM products');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener productos." });
        }
    },

    // BUSCAR PRODUCTOS POR NOMBRE (Para clientes)
    searchProducts: async (req, res) => {
        try {
            const { q } = req.query; // Parámetro de búsqueda desde query string
            if (!q) {
                return res.status(400).json({ message: "Se requiere un término de búsqueda." });
            }
            
            const query = 'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?';
            const searchTerm = `%${q}%`;
            const [rows] = await db.query(query, [searchTerm, searchTerm]);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error al buscar productos." });
        }
    },

    // AGREGAR UN PRODUCTO NUEVO (Solo Admins)
    createProduct: async (req, res) => {
        try {
            const { name, description, price, stock, image_url } = req.body;
            const query = 'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [name, description, price, stock, image_url]);
            
            res.status(201).json({ message: "Producto creado", idProduct: result.insertId });
        } catch (error) {
            res.status(500).json({ message: "Error al crear producto." });
        }
    },

    // MODIFICAR UN PRODUCTO (PUT) (Solo Admins)
    updateProduct: async (req, res) => {
        try {
            const id = req.params.id; // Vendrá de la URL: /api/products/1
            const { name, description, price, stock, image_url } = req.body;
            
            const query = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE idProduct = ?';
            const [result] = await db.query(query, [name, description, price, stock, image_url, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Producto no encontrado." });
            }

            res.json({ message: "Producto actualizado correctamente." });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar producto." });
        }
    }
};

module.exports = productController;