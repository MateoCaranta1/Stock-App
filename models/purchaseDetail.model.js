const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Purchase} = require('../models/purchase.model'); 
const { Product } = require('../models/product.model')

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
