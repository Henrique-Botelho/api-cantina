const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtos.controller');
const { verificaUsurio, verificaChaveDeAcesso } = require('../middleware/auth.middleware');

// Rota para pegar todos os produtos
router.get('/', verificaChaveDeAcesso, produtosController.pegaTodosProdutos)

// Rota para pegar todos os produtos de uma certa categoria
router.get('/:categoria', verificaChaveDeAcesso, produtosController.pegaProdutoCategoria);

// Rota para cadastrar novo produto
router.post('/', verificaUsurio, produtosController.insereProduto);

// Rota para alterar um produto
router.put('/:id', verificaUsurio, produtosController.atualizaProduto);

// Rota para deletar um produto
router.delete('/:id', verificaUsurio, produtosController.deletaProduto);

module.exports = router;