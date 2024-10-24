const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redisClient = require('../config/redis');

exports.registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const id = await Usuario.crear(nombre, email, password);
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.buscarPorEmail(email);
        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.perfil = async (req, res) => {
    try {
        const cacheKey = `usuario:${req.usuario.id}`;
        const cachedUser = await redisClient.get(cacheKey);

        if (cachedUser) {
            return res.json(JSON.parse(cachedUser));
        }

        const usuario = await Usuario.buscarPorId(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await redisClient.set(cacheKey, JSON.stringify(usuario), 'EX', 3600);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};