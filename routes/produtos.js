const express = require('express');
const { response } = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const produtosController = require('../controllers/produtos-controller');

router.get('/', login, produtosController.getProdutos);
router.post('/', login, produtosController.postProdutos);
router.get('/:id_produto', login, produtosController.getUmProduto);
router.patch('/', login, produtosController.patchProduto);
router.delete('/', login, produtosController.deleteProduto);

module.exports = router;