const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');
app.post("/login", (req, resp) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                descripcion: err
            });
        }
        if (!usuarioDb) {
            return resp.status(500).json({
                ok: false,
                err: { message: "usuario incorrectos" }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
            return resp.status(500).json({
                ok: false,
                err: { message: "contraseña incorrectos" }
            });
        }
        let token = jwt.sign({
            data: usuarioDb
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });
        return resp.json({
            ok: true,
            usuario: usuarioDb,
            token
        });
    })

})
module.exports = app;