const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtos.controller');

router.get("/", produtosController.pegaTodosProdutos)
router.post("/", produtosController.insereProduto);

module.exports = router;