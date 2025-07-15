const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const getAllUsers = async () => {
    return await User.findAll();
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const createUser = async (data) => {
    return await User.create(data);
};

const login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    login
};