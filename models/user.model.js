const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Users',
    timestamps: true,
  });

  User.beforeCreate(async (user) => {
    const SALT_ROUND = 10;
    user.password = await bcrypt.hash(user.password, SALT_ROUND);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      const SALT_ROUND = 10;
      user.password = await bcrypt.hash(user.password, SALT_ROUND);
    }
  });

  return User;
};
