const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Purchase, Product } = require('../models');

const PurchaseDetail = sequelize.define('PurchaseDetail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  purchaseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Purchase,
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precioUnitario: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = PurchaseDetail;