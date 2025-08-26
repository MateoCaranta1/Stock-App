const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transporter = require('../config/mailer');

exports.getAll = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.createUser(email, password);
    res.status(201).json({ message: 'Usuario creado con éxito!' });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'El email ya está registrado.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.login(email, password);
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas.' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token });
  } catch (err) {
    console.error('LOGIN ERROR: ', err);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};

exports.logout = async (req, res) => {
  res
    .clearCookie('access_token')
    .json({ message: 'Se cerró sesión con éxito' });
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const token = await userService.generateResetToken(email);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: '"Soporte App" <no-reply@miapp.com>',
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Hacé clic en este enlace para restablecer tu contraseña: ${resetLink}`,
      html: `<p>Hacé clic en este enlace para restablecer tu contraseña:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: 'Correo de recuperación enviado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    await userService.resetPassword(token, newPassword);
    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};