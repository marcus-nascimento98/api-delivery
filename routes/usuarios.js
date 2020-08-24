const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const usuariosController = require('../controllers/usuarios-controller');
const login = require('../middleware/login');
const bcrypt = require('bcrypt');

router.post('/cadastro', usuariosController.postCadastroUsuario);
router.get('/', usuariosController.getUsuarios);
router.patch('/desativar', usuariosController.patchDesativarUsuario);
router.patch('/ativar', usuariosController.patchAtivarUsuario);
router.get('/:id_usuario', usuariosController.getUmUsuario);
router.post('/login', usuariosController.postLoginUsuario);

module.exports = router;