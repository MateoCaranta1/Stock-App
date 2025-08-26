const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Inicializar modelos
const User = require('./user.model')(sequelize, DataTypes);
const Product = require('./product.model')(sequelize, DataTypes);
const Sale = require('./sale.model')(sequelize, DataTypes);
const SaleDetail = require('./saleDetail.model')(sequelize, DataTypes);
const Purchase = require('./purchase.model')(sequelize, DataTypes);
const PurchaseDetail = require('./purchaseDetail.model')(sequelize, DataTypes);

// -------- Asociaciones -----------

// Ventas
User.hasMany(Sale, { foreignKey: 'userId', as: 'ventas' });
Sale.belongsTo(User, { foreignKey: 'userId', as: 'usuarioVenta' });

Sale.hasMany(SaleDetail, { foreignKey: 'saleId', as: 'detalles', onDelete: 'CASCADE' });
SaleDetail.belongsTo(Sale, { foreignKey: 'saleId', as: 'venta' });

Product.hasMany(SaleDetail, { foreignKey: 'productId', as: 'detallesVenta' });
SaleDetail.belongsTo(Product, { foreignKey: 'productId', as: 'productoVenta' });

// Compras
User.hasMany(Purchase, { foreignKey: 'userId', as: 'compras' });
Purchase.belongsTo(User, { foreignKey: 'userId', as: 'usuarioCompra' });

Purchase.hasMany(PurchaseDetail, { foreignKey: 'purchaseId', as: 'detalles' });
PurchaseDetail.belongsTo(Purchase, { foreignKey: 'purchaseId', as: 'compra' });

Product.hasMany(PurchaseDetail, { foreignKey: 'productId', as: 'detallesCompra' });
PurchaseDetail.belongsTo(Product, { foreignKey: 'productId', as: 'productoCompra' });

module.exports = {
  sequelize,
  User,
  Product,
  Sale,
  SaleDetail,
  Purchase,
  PurchaseDetail
};
