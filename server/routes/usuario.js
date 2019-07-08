const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express()
const { verificaToken, verificaRol } = require('../middlewares/authentication');


app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let campos = req.query.campos || "";
    desde = Number(desde);
    limite = Number(limite);
    Usuario.find({ estado: true }, campos)
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    descripcion: err
                });
            } else {
                Usuario.countDocuments({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        conteo
                    });
                })

            }
        })

})
app.post('/usuario', [verificaToken, verificaRol], function(req, res) {
    let body = req.body;
    var pass = bcrypt.hashSync(body.password, 10);
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: pass,
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                descripcion: err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }

    })
})
app.put('/usuario/:id', [verificaToken, verificaRol], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "email", "img", "estado"]);

    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                descripcion: err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    })
})
app.delete('/usuario/:id', [verificaToken, verificaRol], function(req, res) {
    let id = req.params.id;
    console.log(id);
    let cambiarEstado = {
            estado: false
        }
        //Usuario.findByIdAndRemove(id, (err, deleteUsuario) => {
    Usuario.findOneAndUpdate(id, cambiarEstado, { new: true, runValidators: true }, (err, deleteUsuario) => {
        if (err) {
            res.status(400).json({
                ok: false,
                descripcion: err
            });
        }
        if (!deleteUsuario) {
            res.status(400).json({
                ok: false,
                descripcion: "Usuario no encontrado"
            });
        } else {
            res.json({
                ok: true,
                usuario: deleteUsuario
            });
        }
    })
})

module.exports = app;