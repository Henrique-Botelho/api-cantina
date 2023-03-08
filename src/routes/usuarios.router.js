const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

// Rota para cadastrar um novo usuário
router.post('/cadastro', usuariosController.cadastraUsuario);

// Rota para logar um usuário
router.post('/', usuariosController.login);

module.exports = router;