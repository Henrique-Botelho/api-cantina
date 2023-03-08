const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');

//Rota para cadastrar um cliente
router.post('/', clientesController.cadastraCliente);

//Rota para listar todos os clientes
router.get('/', clientesController.listaClientes);

//Rota para atualizar um cliente específico
router.put('/:id', clientesController.atualizaCliente);

//Rota para excluir um cliente específico
router.delete('/:id', clientesController.deletaCliente);

module.exports = router;