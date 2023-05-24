const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verificaUsuario } = require('../middleware/auth.middleware');

// Rota para logar um usuário
router.post('/', usuariosController.login);

// Rota esqueci a senha
router.post('/esqueci-senha', usuariosController.esqueciSenha);

// Rota para trocar a senha
router.post('/alterar-senha', usuariosController.trocarSenha);

// Rota para cadastrar um novo usuário
router.post('/cadastro', verificaUsuario, usuariosController.cadastraUsuario);

// Rota para a verificação do token
router.post('/verifica-token', verificaUsuario, usuariosController.verificaToken);


module.exports = router;