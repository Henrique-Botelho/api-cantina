const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/compras.controller');

// Rota de criar nova compra
router.post('/', comprasController.criarCompra);

// Rota de alterar a compra
router.put('/:id', comprasController.alterarCompra);

// Rota de excluir a compra
router.delete('/compras/:id', comprasController.excluirCompra);

// Rota de pegar todas as compras
// router.get("/compras", comprasController.pegarCompras);

// Rota para listar todas as compras de um usuário específico
router.get("/compras/:id_cliente", comprasController.listarComprasPorUsuario);

module.exports = router;