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

      if (payload.token) {
        try {
          const innerPayload = jwt.decode(payload.token);

          if (!innerPayload) {
            return res.status(403).json({ error: 'Token interno inválido' });
          }

          req.user = innerPayload;
          return next();

        } catch (innerErr) {
          return res.status(403).json({ error: 'Error decodificando token interno' });
        }
      }

      req.user = payload;
      next();
    });
  } catch (error) {
    console.error('Error en authToken middleware:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = authToken;
