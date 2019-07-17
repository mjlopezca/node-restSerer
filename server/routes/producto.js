const express = require('express');

let _ = require('underscore');

let app = express()

let { verificaRol, verificaToken } = require('../middlewares/authentication');

let Producto = require('../models/producto');
app.get('/producto/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    descripcion: err
                });
            }
            if (producto) {
                return res.json({
                    ok: true,
                    producto
                });
            } else {
                return res.status(500).json({
                    ok: false,
                    descripcion: 'No se encontro '
                });
            }
        })
})
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let campos = req.query.campos || "";
    desde = Number(desde);
    limite = Number(limite);
    Producto.find({ disponible: true })
        .sort('description')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    descripcion: err
                });
            } else {
                Producto.countDocuments({ disponible: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        productos,
                        conteo
                    });
                })

            }
        })
});
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, function(err, producto) {
        if (err) {
            return res.status(400).json({
                ok: false,
                descripcion: err
            });
        }
        if (producto) {
            return res.json({
                ok: true,
                producto
            });
        } else {
            return res.status(500).json({
                ok: false,
                descripcion: 'No se encontro el id'
            });
        }
    });



});

app.post('/producto/', verificaToken, (req, res) => {
    console.log(req.usuario);
    let idUsuar = req.usuario._id;
    let body = req.body;
    console.log("idUsuar" + idUsuar);
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoriaId,
        usuario: idUsuar
    });
    producto.save((err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                descripcion: err
            });
        } else {
            res.json({
                ok: true,
                usuario: productoDB
            });
        }

    })
})

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                descripcion: err
            });
        } else {
            res.json({
                ok: true,
                producto: productoDB
            });
        }
    })
})


app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let cambiarEstado = {
        disponible: false
    }
    Producto.findOneAndUpdate(id, cambiarEstado, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                descripcion: err
            });
        } else {
            res.json({
                ok: true,
                producto: productoDB
            });
        }
    })
})
module.exports = app;