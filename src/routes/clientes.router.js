const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');

router.post('/', clientesController.cadastraCliente);
router.get('/', clientesController.listaClientes);
router.put('/:id', clientesController.atualizaCliente);
router.delete('/:id', clientesController.deletaCliente);



module.exports = router;