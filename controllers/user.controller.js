const userService = require('../services/user.service');

exports.getAll = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Erro al obtener los usuarios.' });
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
        const user = await userService.createUser(req.body);
        res.status(201).json(id);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear usuario.' });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await userService.login(email, password);
        if (!user) return res.status(404).json({ error: 'Credenciales incorrectas.' });
        res.status(201).json({ message: 'Bienvenido.' });
    } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
};