const mongoose = require('mongoose');
const con = require('../database/conecct');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type:String,
        required: true,
        select: false,
    },
    cpf:{
        type: String,
        unique: true,
    },
    telefone:{
        type:String,
        required:true
    },
    Agendamento:[{
        Data:String,
        Retorno:String,
        Descricao:String,
        Medico:String
    }],
    createAt: {
        type: Date,
        default: Date.now,
    },
});



UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

module.exports = con.model('Usuario', UserSchema, 'Usuario');

