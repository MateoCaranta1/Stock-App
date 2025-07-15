const User = require('./user.model');
const Product = require('./product.model');
const Sale = require('./sale.model');
const SaleDetail = require('./saleDetail.model');
const Purchase = require('./purchase.model');
const PurchaseDetail = require('./purchaseDetail.model');

// --- Asociaciones de Ventas ---
Sale.hasMany(SaleDetail, {
  foreignKey: 'saleId',
  as: 'detalles',
  onDelete: 'CASCADE',
});
SaleDetail.belongsTo(Sale, {
  foreignKey: 'saleId',
  as: 'venta',
});

Product.hasMany(SaleDetail, {
  foreignKey: 'productId',
});
SaleDetail.belongsTo(Product, {
  foreignKey: 'productId',
});

User.hasMany(Sale, {
  foreignKey: 'userId',
});
Sale.belongsTo(User, {
  foreignKey: 'userId',
});

// --- Asociaciones de Compras ---
Purchase.hasMany(PurchaseDetail, {
  foreignKey: 'purchaseId',
  as: 'detalles',
  onDelete: 'CASCADE',
});
PurchaseDetail.belongsTo(Purchase, {
  foreignKey: 'purchaseId',
  as: 'compra',
});

Product.hasMany(PurchaseDetail, {
  foreignKey: 'productId',
});
PurchaseDetail.belongsTo(Product, {
  foreignKey: 'productId',
});

User.hasMany(Purchase, {
  foreignKey: 'userId',
});
Purchase.belongsTo(User, {
  foreignKey: 'userId',
});

// --- Exportación centralizada de modelos ---
module.exports = {
  User,
  Product,
  Sale,
  SaleDetail,
  Purchase,
  PurchaseDetail,
};
