const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

router.post('/registro', usuarioController.registro);
router.post('/login', usuarioController.login);
router.get('/perfil', auth, usuarioController.perfil);

module.exports = router;