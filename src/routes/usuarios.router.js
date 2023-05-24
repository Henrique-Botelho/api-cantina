const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verificaUsuario } = require('../middleware/auth.middleware');

// Rota para cadastrar um novo usuário
router.post('/cadastro', verificaUsuario, usuariosController.cadastraUsuario);

// Rota para logar um usuário
router.post('/', usuariosController.login);

// Rota para a verificação do token
router.post('/verifica-token', verificaUsuario, usuariosController.verificaToken);

// Rota esqueci a senha
router.get('/esqueci-senha', usuariosController.esqueciSenha);


module.exports = router;