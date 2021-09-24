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
    sexo:{
        type:String,
        required:true
    },
    cpf:{
        type: String,
        unique: true,
    },
    telefone:{
        type:String,
        required:true
    },
    nacionalidade:{
        type:String,
        required:true
    },
    endereco:{
        rua:{
            type:String
        },
        bairro:{
            type:String
        },
        numero:{
            type:String
        },
        cep:{
            type:String
        }
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

