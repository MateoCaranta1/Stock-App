const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getAll = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        const usersWithoutPassword = users.map(user => {
            const userJSON = user.toJSON();
            delete userJSON.password;
            return userJSON;
        });
        res.json(usersWithoutPassword);
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
        console.log('✅ Usuario creado:', user);
        res.status(201).json({ id: user.id });
    } catch (err) {
        console.error('❌ Error al crear usuario:', err.message);
        res.status(500).json({ error: err.message });
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
        res.status(200).json({ message: 'Bienvenido.' });
    } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
};

