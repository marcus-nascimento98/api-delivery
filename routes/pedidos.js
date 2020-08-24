const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const pedidosController = require('../controllers/pedidos-controller');

router.get('/', pedidosController.getPedidos);
router.post('/', pedidosController.postPedidos);
router.get('/:id_pedido', pedidosController.getUmPedido);
router.delete('/', pedidosController.delPedido);

module.exports = router;