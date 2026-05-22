// backend/controllers/authController.js
const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
    // REGISTRO DE CLIENTES
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Encriptar la contraseña (10 salt rounds es el estándar)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insertar en la base de datos
            const query = 'INSERT INTO clients (username, email, password) VALUES (?, ?, ?)';
            await db.query(query, [username, email, hashedPassword]);

            res.status(201).json({ message: "Usuario registrado exitosamente." });
        } catch (error) {
            console.error("Error en registro:", error);
            // Error 1062 en MySQL es "Duplicate entry"
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "El usuario o correo ya existe." });
            }
            res.status(500).json({ message: "Error interno del servidor." });
        }
    },

    // INICIO DE SESIÓN (Clientes y Administradores)
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            let user = null;
            let role = 'client';
            let idField = 'idClient';

            // 1. Buscar primero en la tabla de clientes
            const [clients] = await db.query('SELECT * FROM clients WHERE username = ?', [username]);
            
            if (clients.length > 0) {
                user = clients[0];
            } else {
                // 2. Si no es cliente, buscar en la tabla de administradores
                const [admins] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
                if (admins.length > 0) {
                    user = admins[0];
                    role = 'admin';
                    idField = 'idAdmin';
                }
            }

            // Si no se encontró en ninguna tabla
            if (!user) {
                return res.status(401).json({ message: "Credenciales incorrectas." });
            }

            // Verificar contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Credenciales incorrectas." });
            }

            // Generar Token JWT con el ID y el ROL
            const tokenPayload = {
                id: user[idField],
                role: role
            };

            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '8h' });

            res.json({ 
                message: "Inicio de sesión exitoso.", 
                token: token,
                role: role
            });

        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).json({ message: "Error interno del servidor." });
        }
    }
};

module.exports = authController;