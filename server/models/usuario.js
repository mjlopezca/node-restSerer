const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const uniqueValidator = require('mongoose-unique-validator');
let rolesValid = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: '{VALUE} no es un rol valido'
}
let Schema = mongoose.Schema;
let UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValid
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});
UsuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
UsuarioSchema.index({
    email: 1
}, {
    unique: true,
});
UsuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe sere unico" })
module.exports = mongoose.model('Usuario', UsuarioSchema);