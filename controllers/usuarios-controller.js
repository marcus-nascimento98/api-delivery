const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postCadastroUsuario = (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, results) => {
            if (error) return res.status(500).send({ error: error })
            if (results.length > 0) {
                res.status(409).send({ mensagem: 'Usuário já cadastrado' });
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                        `INSERT INTO usuarios (nome, telefone, senha, email, status) VALUES (?,?,?,?,?)`,
                        [req.body.nome, req.body.telefone, hash, req.body.email, req.body.status],
                        (error, results) => {
                            conn.release();
                            if (error) return res.status(500).send({ error: error })
                            response = {
                                mensagem: "Usuário criado com sucesso!",
                                usuarioCriado: {
                                    id_usuario: results.insertId,
                                    nome: req.body.nome,
                                    telefone: req.body.telefone,
                                    email: req.body.email,
                                    status: req.body.status
                                }
                            }
                            return res.status(201).send(response);
                        }
                    )
                })
            }
        })
    });
};

exports.getUsuarios = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM usuarios;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.lenght,
                    usuarios: result.map(usu => {
                        return {
                            id_usuario: usu.id_usuario,
                            nome: usu.nome,
                            telefone: usu.telefone,
                            senha: usu.senha,
                            email: usu.email,
                            status: usu.status
                        }
                    })
                }
                return res.status(200).send({ response })
            }
        )
    });
};

exports.patchDesativarUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error })
        conn.query(
            //`UPDATE FROM usuarios WHERE id_usuario = ?`,
            `UPDATE usuarios SET status = 0 WHERE id_usuario = ?`,
            [req.body.id_usuario],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Usuario desativado com sucesso!',
                }
                return res.status(202).send(response);
            }
        )
    });
};

exports.patchAtivarUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error })
        conn.query(
            //`UPDATE FROM usuarios WHERE id_usuario = ?`,
            `UPDATE usuarios SET status = 1 WHERE id_usuario = ?`,
            [req.body.id_usuario],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Usuario ativado com sucesso!',
                }
                return res.status(202).send(response);
            }
        )
    });
};

exports.getUmUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?;',
            [req.params.id_usuario],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o usuario com esse ID'
                    })
                }
                const response = {
                    usuario: {
                        id_usuario: result[0].id_usuario,
                        nome: result[0].nome,
                        telefone: result[0].telefone,
                        senha: result[0].senha,
                        email: result[0].email
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
};

exports.postLoginUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        const query = `SELECT * FROM usuarios WHERE email = ?`;
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação' })
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação' });
                }
                if (results[0].status == 1) {
                    if (result) {
                        const token = jwt.sign({
                            id_usuario: results[0].id_usuario,
                            email: results[0].email
                        }, process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            });
                        return res.status(200).send({
                            mensagem: 'Autenticado com sucesso!',
                            token: token
                        });
                    }
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            })
        })
    })
};