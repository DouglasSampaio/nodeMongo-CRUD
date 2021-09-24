const mongoose = require('mongoose');
const con = require('../database/conecct');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    Agendamento: {
        type: String,
        require: true,
    },
    Descricao: {
        type: String
    },
    Preco: {
        type: String
    },
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

module.exports = con.model('User', UserSchema, 'User');

