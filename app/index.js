const express = require('express');
const morgan = require('morgan');
const app = express();

//Connect to mongoDB
const { mongoose } = require('./database');

//Midlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes server
app.use('/api', require('./routes/server'));

//Port
app.set('port', process.env.PORT || 21888);

//Config run server
app.listen(app.get('port'), () =>{
    console.log('Api-Backend-Noc port: ' + app.get('port'))
});