const jwt = require('jsonwebtoken');
require('dotenv').config();

const authToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
      }

      req.user = payload;     
      req.userId = payload.id; 
      next();
    });
  } catch (error) {
    console.error('Error en authToken middleware:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = authToken;

