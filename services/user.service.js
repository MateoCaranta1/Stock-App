const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const getAllUsers = async () => {
    return await User.findAll();
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const createUser = async (email, password) => {
    Validation.email(email);
    Validation.password(password);

    return await User.create(email, password);
};

const login = async (email, password) => {
    Validation.email(email);
    Validation.password(password);

    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
};

class Validation {
    static email(email) {
        if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('El email no es válido.');
        }
    };

    static password(password) {
        if (typeof password !== 'string') throw new Error('La contraseña debe ser una cadena de texto.');
        if (password.length < 4) throw new Error('La contraseña debe tener más de 3 carácteres.');
        if (!/[A-Z]/.test(password)) throw new Error('La contraseña debe tener al menos una letra mayúscula.');
        if (!/[a-z]/.test(password)) throw new Error('La contraseña debe tener al menos una letra minúscula.');
        if (!/[0-9]/.test(password)) throw new Error('La contraseña debe tener al menos un número.');
    };
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    login
};