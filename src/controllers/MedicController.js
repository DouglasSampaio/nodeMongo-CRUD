const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Medic = require('../models/Medic');

const authConfig = require('../config/auth.json')

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/medic', async (req, res) => {
    try {
        const medic = await Medic.create(req.body);

        return res.send({
            medic: medic,
            token: generateToken({ id: medic.id })
        })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: err })
    }
})

router.get('/medic', async (req, res) => {
    try {
        //console.log("oi")
        const medics = await Medic.find();

        //console.log(usuarios[0])
        return res.send({ medics });

    } catch (err) {
        return res.status(400).send({ error: 'pesquisa invalida' });
    }
});

router.put('/medics/:email', async (req, res) => {
    const { email } = req.params

    try {
        const medic = await Medic.find({ email })
        // console.log(email)
        if (medic.length == 0) {
            return res.status(400).send({ error: 'failed' });
        }


        //console.log(req.body.rua)
        const updateMedic = await Medic.updateOne({ email }, {
            $set: {
                name: req.body.name,
                telefone: req.body.telefone,
                naturalidade: req.body.naturalidade,
                dataNascimento: req.body.dataNascimento
            }
        })



        // console.log(usuarios[0])
        return res.send({ updateMedic });

    } catch (err) {
        return res.status(400).send({ error: err });
    }
});

router.delete('/medics/:email', async (req, res) => {
    const { email } = req.params
    try {
        const deleteMedic = await Medic.deleteOne({ email })
        if (!deleteMedic.deletedCount) {
            return res.send({ erro: 'Medico Não Encontrado' })
        }
        // console.log(usuarios[0])
        return res.send({ deleteMedic: deleteMedic });

    } catch (err) {
        return res.status(400).send({ error: 'delete failed' });
    }
});

router.post('/authenticateMedic', async (req, res) => {
    const { email, password } = req.body;

    const medic = await Medic.findOne({ email }).select('+password');

    if (!medic)
        return res.status(400).send({ error: 'medic not found' })

    if (!await bcrypt.compare(password, medic.password))
        return res.status(400).send({ error: 'invalid password' })

    medic.password = undefined;


    res.send({
        user: medic, token: generateToken({ id: medic.id })
    })
});


module.exports = app => app.use('/auth', router);