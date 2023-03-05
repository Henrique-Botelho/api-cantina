const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtos.controller');

router.post("/", produtosController.insereProduto);

module.exports = router;