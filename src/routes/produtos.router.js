const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtos.controller');
const { verificaUsuario, verificaChaveDeAcesso } = require('../middleware/auth.middleware');

// Rota para pegar todos os produtos
router.get('/', verificaChaveDeAcesso, produtosController.pegaTodosProdutos)

// Rota para cadastrar novo produto
router.post('/', verificaUsuario, produtosController.insereProduto);

// Rota para alterar um produto
router.put('/:id', verificaUsuario, produtosController.atualizaProduto);

// Rota para deletar um produto
router.delete('/:id', verificaUsuario, produtosController.deletaProduto);

module.exports = router;