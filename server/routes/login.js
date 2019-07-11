const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLEINTID);
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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLEINTID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(payload.name);
    console.log(payload.picture);
    console.log(payload.email);
    return {
        name: payload.name,
        img: payload.picture,
        email: payload.email,
        google: true
    }
}

app.post("/google", async(req, resp) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(e => {
        return resp.status(403).json({
            ok: false,
            err: e
        });
    });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDb) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                descripcion: err
            });
        }
        if (usuarioDb) {
            if (usuarioDb.google === false) {
                return resp.status(400).json({
                    ok: false,
                    descripcion: 'Se autentico con email'
                });
            } else {
                let token = jwt.sign({
                    data: usuarioDb
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });
                return resp.status(200).json({
                    ok: true,
                    usuarioDb,
                    token
                })
            }
        } else {
            let usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.password = "sms33u12nnckd9333";
            usuario.img = googleUser.picture;
            usuario.google = true;
            usuario.save((err, userSave) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        descripcion: err
                    });
                } else {
                    let token = jwt.sign({
                        data: userSave
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });
                    return resp.status(200).json({
                        ok: true,
                        userSave,
                        token
                    })
                }
            })

        }
    })


})
module.exports = app;