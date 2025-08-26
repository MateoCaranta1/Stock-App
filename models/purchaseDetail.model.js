const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PurchaseDetail', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    purchaseId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precioUnitario: { type: DataTypes.FLOAT, allowNull: false },
  }, {
    tableName: 'PurchaseDetails',
    timestamps: false,
  });
};

