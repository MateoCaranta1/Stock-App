const User = require('../models/user.model');

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
    const user = await User.findByEmail(email);
    if (!user) return null;
    return await User.login(email, password);
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    login
};