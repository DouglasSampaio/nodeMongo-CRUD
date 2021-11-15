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
    crm:{
        type:String,
        required:true
    },
    telefone:{
        type:String,
        required:true
    },
    naturalidade:{
        type:String,
        required:true
    },
    dataNascimento:{
        type:String,
        required:true
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

