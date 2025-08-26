const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    categoria: { type: DataTypes.STRING, allowNull: true },
    precio: { type: DataTypes.FLOAT, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    stockMinimo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
  }, {
    tableName: 'Products',
    timestamps: true,
  });
};