const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { User } = require('../models');  // Importar solo User

const Purchase = sequelize.define('Purchase', {
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
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  tableName: 'Purchases', // Opcional pero recomendable
});

module.exports = Purchase;
