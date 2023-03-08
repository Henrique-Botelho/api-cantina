const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtos.controller');

// Rota para pegar todos os produtos
router.get('/', produtosController.pegaTodosProdutos)

// Rota para pegar todos os produtos de uma certa categoria
router.get('/:categoria', produtosController.pegaProdutoCategoria);

// Rota para cadastrar novo produto
router.post('/', produtosController.insereProduto);

// Rota para alterar um produto
router.put('/:id', produtosController.atualizaProduto);

// Rota para deletar um produto
router.delete('/:id', produtosController.deletaProduto);

module.exports = router;