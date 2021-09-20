const mongoose = require('mongoose');
require('dotenv').config();

//console.log(process.env)
module.exports = mongoose.createConnection(process.env.CONECTION_LOCAL_MONGODB_KEY,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useFindAndModify: false,
        //useCreateIndex: true,
    },
)