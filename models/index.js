const User = require('./user.model');
const Product = require('./product.model');
const Sale = require('./sale.model');
const SaleDetail = require('./saleDetail.model');
const Purchase = require('./purchase.model');
const PurchaseDetail = require('./purchaseDetail.model');

// Asociaciones de Ventas
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
  as: 'detallesVenta',
});
SaleDetail.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'productoVenta',
});

User.hasMany(Sale, {
  foreignKey: 'userId',
  as: 'ventas',
});
Sale.belongsTo(User, {
  foreignKey: 'userId',
  as: 'usuarioVenta',
});

// Asociaciones de Compras
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
  as: 'detallesCompra',
});
PurchaseDetail.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'productoCompra',
});

User.hasMany(Purchase, {
  foreignKey: 'userId',
  as: 'compras',
});
Purchase.belongsTo(User, {
  foreignKey: 'userId',
  as: 'usuarioCompra',
});

// Exportación centralizada de modelos
module.exports = {
  User,
  Product,
  Sale,
  SaleDetail,
  Purchase,
  PurchaseDetail,
};
