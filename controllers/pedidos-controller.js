const mysql = require('../mysql').pool;
const login = require('../middleware/login');


exports.getPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT * FROM pedidos;`,
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                conn.release();
                const response = {
                    quantidade: result.lenght,
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            preco: pedido.preco,
                            descricao: pedido.descricao,
                            fkUsuario: pedido.usuarios_id_usuario,
                        }
                    }),
                }
                return res.status(200).send({ response })
            }
        )
    });
};

exports.postPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error })
        conn.query('SELECT * FROM usuarios WHERE id_usuario = ?',
            [req.body.usuarios_id_usuario],
            (error, result, field) => {
                if (error) return res.status(500).send({ error: error })
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Usuario não encontrado'
                    })
                }
                conn.query(
                    'INSERT INTO pedidos (usuarios_id_usuario, preco, descricao) VALUES (?, ?, ?)',
                    [req.body.usuarios_id_usuario, req.body.preco, req.body.descricao],
                    (error, result, field) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: error }) }
                        const response = {
                            mensagem: 'Pedido inserido com sucesso',
                            pedidoCriado: {
                                id_pedido: result.id_pedido,
                                fkUsuario: req.body.usuarios_id_usuario,
                                preco: req.body.preco,
                                descricao: req.body.descricao
                            }
                        }
                        return res.status(201).send(response);
                    }
                )
            });
    });
};

exports.getUmPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?;',
            [req.params.id_pedido],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length == 0) {
                    return res.status(404).send({ mensagem: 'Pedido não encontrado' })
                }
                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        preco: result[0].preco,
                        descricao: result[0].descricao,
                        fkUsuario: result[0].usuarios_id_usuario
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
}

exports.delPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error })
        conn.query('SELECT * FROM pedidos WHERE id_pedido = ?',
            [req.body.id_pedido],
            (error, result, field) => {
                if (error) return res.status(500).send({ error: error })
                if (result.length == 0) { return res.status(404).send({ mensagem: 'Pedido não encontrado' }) }
                conn.query(
                    `DELETE FROM pedidos WHERE id_pedido = ?`,
                    [req.body.id_pedido],
                    (error, result, field) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: error }) }
                        const response = { mensagem: 'Pedido removido com sucesso!' }
                        return res.status(202).send(response);
                    }
                )
            }
        )
    });
};