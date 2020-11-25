const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const pedidosController = require('../controllers/pedidos-controller');

router.get('/', login, pedidosController.getPedidos);
router.post('/', login, pedidosController.postPedidos);
router.get('/:id_pedido', login, pedidosController.getUmPedido);
router.delete('/', login, pedidosController.delPedido);

module.exports = router;