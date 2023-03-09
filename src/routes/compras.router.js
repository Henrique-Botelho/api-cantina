const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/compras.controller');
const { verificaUsuario } = require('../middleware/auth.middleware');

// Rota de criar nova compra
router.post('/', verificaUsuario, comprasController.criarCompra);

// Rota de alterar a compra
router.put('/:id', verificaUsuario, comprasController.alterarCompra);

// Rota de excluir a compra
router.delete('/:id', verificaUsuario, comprasController.excluirCompra);

// Rota de pegar todas as compras
router.get("/", verificaUsuario, comprasController.listarCompras);

// Rota para listar todas as compras de um cliente específico
router.get("/:numero", verificaUsuario, comprasController.listarComprasPorUsuario);

module.exports = router;