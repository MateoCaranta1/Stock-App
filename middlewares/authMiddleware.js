const jwt = require('jsonwebtoken');
require('dotenv').config();

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1];

    if (!token) return res.status(201).json({ error: 'Token no proporcionado.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado' });

        req.user = user; 
        next();
    });
};

module.exports = authToken;