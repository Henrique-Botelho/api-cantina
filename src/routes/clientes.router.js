const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');
const { verificaUsuario } = require('../middleware/auth.middleware');

//Rota para cadastrar um cliente
router.post('/', verificaUsuario, clientesController.cadastraCliente);

//Rota para listar todos os clientes
router.get('/', verificaUsuario, clientesController.listaClientes);

//Rota para listar cliente específico 
router.get('/:id', verificaUsuario, clientesController.listaCLiente);

//Rota para atualizar um cliente específico
router.put('/:id', verificaUsuario, clientesController.atualizaCliente);

//Rota para excluir um cliente específico
router.delete('/:id', verificaUsuario, clientesController.deletaCliente);

module.exports = router;