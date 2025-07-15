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
    type: DataTypes.INTEGER, // O UUID según User.id
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
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
