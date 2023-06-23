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

// Rota para a verificação do token
router.post('/verifica-token', verificaUsuario, usuariosController.verificaToken);

// Rota para cadastrar um novo usuário
router.post('/cadastro', verificaUsuario, usuariosController.cadastraUsuario);

// Rota para listar os usuários
router.get('/', verificaUsuario, usuariosController.listarUsuarios);

// Rota para editar um usuário
router.put('/:id', verificaUsuario, usuariosController.editarUsuario);

// Rota para excluir um usuário
router.delete('/:id', verificaUsuario, usuariosController.excluirUsuario);

module.exports = router;
