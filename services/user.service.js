const { User } = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class Validation {
  static email(email) {
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('El email no es válido.');
    }
  }

  static password(password) {
    if (typeof password !== 'string') throw new Error('La contraseña debe ser una cadena de texto.');
    if (password.length < 4) throw new Error('La contraseña debe tener más de 3 caracteres.');
    if (!/[A-Z]/.test(password)) throw new Error('La contraseña debe tener al menos una letra mayúscula.');
    if (!/[a-z]/.test(password)) throw new Error('La contraseña debe tener al menos una letra minúscula.');
    if (!/[0-9]/.test(password)) throw new Error('La contraseña debe tener al menos un número.');
  }
}

const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] }
  });
};

const getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
};

const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async (email, password) => {
  Validation.email(email);
  Validation.password(password);

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('El email ya está registrado.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({ email, password: hashedPassword });
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



const generateResetToken = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado.');

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 3600000; // 1 hora
  await user.save();

  return token;
};

const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({ where: { resetToken: token } });
  if (!user || user.resetTokenExpires < Date.now()) {
    throw new Error('Token inválido o expirado.');
  }

  Validation.password(newPassword);

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpires = null;
  await user.save();

  return user;
};


module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  login,
  generateResetToken,
  resetPassword
};
