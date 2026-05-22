// backend/app.js

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ==========================================
// IMPORTACIÓN DE RUTAS
// ==========================================
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const clientRoutes = require('./routes/clientRoutes');

// ==========================================
// CONEXIÓN DE RUTAS (Mounting)
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/clients', clientRoutes);

// Ruta raíz para servir el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada." });
});

// Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en http://localhost:${PORT}`);
});