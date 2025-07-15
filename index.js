const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/db');
const models = require('./models');

// Rutas
const productRoutes = require('./routes/product.routes');
const saleRoutes = require('./routes/sale.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const userRoutes = require('./routes/user.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Rutas principales
app.use('/productos', productRoutes);
app.use('/ventas', saleRoutes);
app.use('/compras', purchaseRoutes);
app.use('/usuarios', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Conexión y sincronización con la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL exitosa.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con MySQL:', err);
  });
