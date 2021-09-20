const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authConfig = require('../config/auth.json')

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);

        return res.send({ 
            user,
            token:generateToken({id:user.id})
         })
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' })
    }
})

router.get('/listUser', async (req, res) => {
    try {
        const usuarios = await User.find();

        // console.log(usuarios[0])
        return res.send({ usuarios });

    } catch (err) {
        return res.status(400).send({ error: 'pesquisa invalida' });
    }
});

router.put('/UpdateUser', async (req, res) => {
    //req.body={name,password};
    try {
        const updateUser = await User.updateOne({ name: 'Douglas' }, {
            $set: {
                name: req.body.name
            }
        })

        // console.log(usuarios[0])
        return res.send({ updateUser });

    } catch (err) {
        return res.status(400).send({ error: 'failed' });
    }
});

router.delete('/DeleteUser', async (req, res) => {
    //req.body={name,password};
    try {
        const deleteUser = await User.deleteOne({ name: req.body.name })
        if (!deleteUser.deletedCount) {
            return res.send({ erro: 'Usuario Não Encontrado' })
        }
        // console.log(usuarios[0])
        return res.send({ deleteUser });

    } catch (err) {
        return res.status(400).send({ error: 'delete failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ error: 'user not found' })

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'invalid password' })

    user.password = undefined;

    // const token = jwt.sign({ id: user.id }, authConfig.secret, {
    //     expiresIn: 86400,
    // });

    res.send({
        user, token:generateToken({id:user.id})
    })
});

module.exports = app => app.use('/auth', router);