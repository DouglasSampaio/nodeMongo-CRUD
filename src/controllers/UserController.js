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

router.post('/registerUser', async (req, res) => {
    try {
        const user = await User.create(req.body);

        return res.send({
            user,
            token: generateToken({ id: user.id })
        })
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' })
    }
})

router.get('/listUser', async (req, res) => {
    try {
        //console.log("oi")
        const usuarios = await User.find();

        //console.log(usuarios[0])
        return res.send({ usuarios });

    } catch (err) {
        return res.status(400).send({ error: 'pesquisa invalida' });
    }
});

router.put('/UpdateUser/:email', async (req, res) => {
    const { email } = req.params

    try {
        const user = await User.find({ email })
        // console.log(email)
        if (user.length == 0) {
            return res.status(400).send({ error: 'failed' });
        }

        const updateUser = await User.updateOne({ email }, {
            $set: {
                name: req.body.name,
                sexo: req.body.sexo,
                telefone: req.body.telefone,
                nacionalidade: req.body.nacionalidade,
                endereco: {
                    rua: req.body.rua,
                    bairro: req.body.bairro,
                    numero: req.body.numero,
                    cep: req.body.cep
                }
            }
        })



        // console.log(usuarios[0])
        return res.send({ updateUser });

    } catch (err) {
        return res.status(400).send({ error: 'failed' });
    }
});

router.delete('/DeleteUser/:email', async (req, res) => {
    const { email } = req.params
    try {
        const deleteUser = await User.deleteOne({ email })
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


    res.send({
        user, token: generateToken({ id: user.id })
    })
});


router.post('/registerAgendamento/:email', async (req, res) => {
    try {
        const { email } = req.params

        const updateUser = await User.updateOne({ email }, {
            $addToSet: {
                Agendamento: {
                    Data: req.body.Data,
                    Retorno: req.body.Retorno,
                    Descricao: req.body.Descricao,
                    Medico: req.body.Medico
                }
            }
        })
        return res.status(200).send({ message: 'Agendamento Cadastrado com sucesso' });


    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' })
    }
})

router.get('/listAgendamentosByUser/:email', async (req, res) => {
    const { email } = req.params

    try {
        const Agendamentos = await User.findOne({ email }, { Agendamento: 1 });
        return res.send({ Agendamentos });

    } catch (err) {
        return res.status(400).send({ Agendamentos: [] });
    }
});

router.put('/UpdateAgendamento/:email/:idAgendamento', async (req, res) => {
    const { email, idAgendamento } = req.params
    // console.log(email, idAgendamento)
    
    // console.log(user[0].Agendamento)
    try {
        const user = await User.find({ email, "Agendamento._id": idAgendamento })

        if (user.length == 0) {
            return res.status(400).send({ error: 'failed' });
        }

        const updateAgendamento = await User.updateOne({ email, "Agendamento._id": idAgendamento }, {
            Agendamento: {
                Data: req.body.Data,
                Retorno: req.body.Retorno,
                Descricao: req.body.Descricao,
                Medico: req.body.Medico,

            }
        })



        // console.log(usuarios[0])
        return res.send({ updateAgendamento });

    } catch (err) {
        return res.status(400).send({ error: 'failed' });
    }
});
router.delete('/DeleteAgendamento/:_id/:idAgendamento', async (req, res) => {
    const { _id, idAgendamento } = req.params
    try {
        const deleteUser = await User.updateOne({
            _id: _id
        }, {
            $pull: {
                Agendamento: {
                    _id: idAgendamento
                }
            }
        })
        if (!deleteUser.modifiedCount) {
            return res.send({ erro: 'Agendamento Não Encontrado' })
        }

        return res.send({ Message: "Agendamento Removido com sucesso" });

    } catch (err) {
        return res.status(400).send({ error: 'delete failed' });
    }
});

module.exports = app => app.use('/auth', router);