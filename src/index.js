const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


require('./controllers/authController')(app);
require('./controllers/UserController')(app);
require('./controllers/projectCrontoller')(app);

app.listen(3000, console.log('Servidor Rodando na porta 3000'))