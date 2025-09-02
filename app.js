const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/db');
const models = require('./models'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static('view'));


// Rutas
const productRoutes = require('./routes/product.routes');
const saleRoutes = require('./routes/sale.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const userRoutes = require('./routes/user.routes');
const reportRoutes = require('./routes/report.routes');

// Rutas principales
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente ✅');
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

// Manejo del mailing
// cron.schedule('59 23 * * *', async () => {
//   const resumen = await summary();
//   await sendMail('Resumen diario de stock', resumen);
//   console.log('Resumen enviado.');
// });

// Conexión y sincronización con la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL exitosa.');
    return sequelize.sync({ alter: true }); // solo en desarrollo
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con MySQL:', err);
    process.exit(1);
  });
