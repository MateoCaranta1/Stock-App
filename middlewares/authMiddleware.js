const jwt = require('jsonwebtoken');
require('dotenv').config();

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token no proporcionado.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado' });

        req.user = payload;
        next();
    });
};

module.exports = authToken;