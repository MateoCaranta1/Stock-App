const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const sequelize = require('../config/database');
const crypto = require('crypto');
const { options } = require('../routes/product.routes');

const id = crypto.randomUUID();

const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
        //Ver de usar el UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.beforeCreate(async (user, options) => {
    const SALT_ROUND = 10;
    user.password = await bcrypt.hash(user.password, SALT_ROUND);
})

module.exports = User;