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
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Users',
    timestamps: true,
  });

  const bcrypt = require('bcrypt');

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