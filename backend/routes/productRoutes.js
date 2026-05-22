// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken');

// Ruta: GET /api/products/search (Buscar productos - debe ir ANTES de '/')
router.get('/search', verifyToken, productController.searchProducts);

// Ruta: GET /api/products (Requiere token normal)
router.get('/', verifyToken, productController.getAllProducts);

// Ruta: POST /api/products (Requiere token de ADMINISTRADOR)
router.post('/', verifyToken, verifyAdmin, productController.createProduct);

// Ruta: PUT /api/products/:id (Requiere token de ADMINISTRADOR)
router.put('/:id', verifyToken, verifyAdmin, productController.updateProduct);

module.exports = router;