// backend/routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken');

// Controlador en línea (para mantenerlo simple, aunque podrías moverlo a un clientController.js)
const getAllClients = async (req, res) => {
    try {
        // Seleccionamos datos no sensibles (excluyendo el password)
        const [clients] = await db.query('SELECT idClient, username, email, createdAt FROM clients');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: "Error al recuperar clientes." });
    }
};

// Ruta: GET /api/clients (Exclusiva para administradores)
router.get('/', verifyToken, verifyAdmin, getAllClients);

module.exports = router;