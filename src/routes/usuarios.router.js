const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');


router.post('/cadastro', usuariosController.cadastraUsuario);
router.post('/', usuariosController.cadastraUsuario);

module.exports = router;