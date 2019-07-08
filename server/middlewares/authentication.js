const jwt = require('jsonwebtoken');
//verificacion

const verificaToken = (req, resp, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return resp.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.data;
        next();
    })


}
const verificaRol = (req, resp, next) => {
    let usuario = req.usuario;

    console.log("usuario" + usuario.role);
    if (usuario.role !== 'ADMIN_ROLE') {
        return resp.status(401).json({
            ok: false,
            err: "Role invalido"
        })
    }
    next();
}
module.exports = {
    verificaToken,
    verificaRol
}