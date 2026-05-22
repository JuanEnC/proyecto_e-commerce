// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/verifyToken');

// Ruta: POST /api/orders (Crear un pedido desde el checkout)
router.post('/', verifyToken, orderController.createOrder);

// Ruta: GET /api/orders (Ver el historial del cliente logueado)
router.get('/', verifyToken, orderController.getMyOrders);

module.exports = router;