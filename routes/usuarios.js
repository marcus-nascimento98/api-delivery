const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const usuariosController = require('../controllers/usuarios-controller');
const login = require('../middleware/login');
const bcrypt = require('bcrypt');

router.post('/cadastro', usuariosController.postCadastroUsuario);
router.get('/', login, usuariosController.getUsuarios);
router.patch('/desativar', login, usuariosController.patchDesativarUsuario);
router.patch('/ativar', login, usuariosController.patchAtivarUsuario);
router.get('/:id_usuario', login, usuariosController.getUmUsuario);
router.post('/login', usuariosController.postLoginUsuario);

module.exports = router;