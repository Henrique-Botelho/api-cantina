const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/compras.controller');
const { verificaUsuario } = require('../middleware/auth.middleware');

// Rota de pegar todas as compras
router.get("/", verificaUsuario, comprasController.listarCompras);

router.post("/", verificaUsuario, comprasController.insereCompra);


module.exports = router;