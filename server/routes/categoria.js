const express = require('express');

let _ = require('underscore');
let Categoria = require('../models/categoria');

let app = express()

let { verificaRol, verificaToken } = require('../middlewares/authentication');


app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find()
        .sort('description')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    descripcion: err
                });
            } else {
                res.json({
                    ok: true,
                    categorias
                });

            }
        })
});
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let categoria = Categoria.findById(id, function(err, categoria) {
        if (err) {
            return res.status(400).json({
                ok: false,
                descripcion: err
            });
        }

        if (categoria) {
            return res.json({
                ok: true,
                categoria
            });
        } else {
            return res.status(500).json({
                ok: false,
                descripcion: 'No se encontro el id'
            });
        }
    });



});

app.post('/categoria/', verificaToken, (req, res) => {
    console.log(req.usuario);
    let idUsuar = req.usuario._id;
    let body = req.body;
    console.log("idUsuar" + idUsuar);
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: idUsuar
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                descripcion: err
            });
        } else {
            res.json({
                ok: true,
                usuario: categoriaDB
            });
        }

    })
})

app.put('/categoria/:id', [verificaRol, verificaToken], (req, res) => {
    let id = req.params.id;
    Categoria.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                descripcion: err
            });
        } else {
            res.json({
                ok: true,
                usuario: categoriaDB
            });
        }
    })
})
app.delete('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                descripcion: err
            });
        }
        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                descripcion: err
            });
        } else {
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        }
    })
})
module.exports = app;