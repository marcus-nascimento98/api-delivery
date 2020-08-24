const express = require('express');
const { response } = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const produtosController = require('../controllers/produtos-controller');

router.get('/', produtosController.getProdutos);
router.post('/', produtosController.postProdutos);
router.get('/:id_produto', produtosController.getUmProduto);
router.patch('/', produtosController.patchProduto);
router.delete('/', produtosController.deleteProduto);

module.exports = router;