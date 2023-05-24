const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/compras.controller');
const { verificaUsuario } = require('../middleware/auth.middleware');

// Rota de pegar todas as compras
router.get("/", verificaUsuario, comprasController.listarCompras);

// Rota de pegar todas as compras por cliente
router.get("/:id", verificaUsuario, comprasController.listarComprasPorCliente);

// Rota de inserir uma nova compra
router.post("/", verificaUsuario, comprasController.insereCompra);

// Rota para finalizar a conta de um cliente
router.put("/:id", verificaUsuario, comprasController.finalizarConta);

// Rota de excluir uma compra
router.delete("/:id", verificaUsuario, comprasController.excluirCompra);

module.exports = router;