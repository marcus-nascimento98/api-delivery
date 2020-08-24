const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const express = require('express');

exports.postItens = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error })
        conn.query(
            'INSERT INTO itens (pedidos_id_pedido, produtos_id_produto) VALUES (?, ?)',
            [req.body.pedidos_id_pedido, req.body.produtos_id_produto],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Itens inserido com sucesso',
                    produtoCriado: {
                        id_item: result.id_item,
                        pedidos_id_pedido: req.body.pedidos_id_pedido,
                        produtos_id_produto: req.body.produtos_id_produto
                    }
                }
                return res.status(201).send(response);
            }
        )
    });
};

exports.getItens = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM itens;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.lenght,
                    produtos: result.map(item => {
                        return {
                            id_item: item.id_item,
                            fkPedido: item.pedidos_id_pedido,
                            fkProduto: item.produtos_id_produto,
                        }
                    })
                }
                return res.status(200).send({ response })
            }
        )
    });
};