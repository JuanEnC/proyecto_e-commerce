// backend/middlewares/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Obtener el token del encabezado 'Authorization: Bearer <token>'
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó un token válido." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token usando la llave secreta de nuestro .env
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Inyectar los datos decodificados (id, role) en el objeto 'req'
        // Así los controladores (ej. orderController) podrán usar req.user.id
        req.user = verified;
        
        // 4. Pasar al siguiente middleware o controlador
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido o expirado." });
    }
};

// Middleware secundario solo para administradores
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Acceso denegado. Se requieren privilegios de administrador." });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };