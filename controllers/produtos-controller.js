const mysql = require('../mysql').pool;
const login = require('../middleware/login');

exports.getProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.lenght,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            descricao: prod.descricao
                        }
                    })
                }
                return res.status(200).send({ response })
            }
        )
    });
};

exports.postProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error })
        conn.query(
            'INSERT INTO produtos (nome, preco, descricao) VALUES (?, ?, ?)',
            [req.body.nome, req.body.preco, req.body.descricao],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        descricao: req.body.descricao
                    }
                }
                return res.status(201).send(response);
            }
        )
    });
};

exports.getUmProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o produto com esse ID'
                    })
                }
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        descricao: result[0].descricao
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
};

exports.patchProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error })
        conn.query(
            `UPDATE produtos SET nome = ?, preco = ?, descricao = ? WHERE id_produto = ?`,
            [req.body.nome, req.body.preco, req.body.id_produto], req.body.descricao,
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        descricao: req.body.descricao
                    }
                }
                res.status(202).send({
                    mensagem: 'Produto alterado com sucesso',
                });
            }
        )
    });
};

exports.deleteProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error })
        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?`,
            [req.body.id_produto],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto removido com sucesso!',
                }
                return res.status(202).send(response);
            }
        )
    });
};