const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID, // Debe coincidir con User.id
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: 'Sales',
  timestamps: true,
});

module.exports = Sale;