const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();

//Environment var
const node_env = process.env.NODE_ENV || 'dev';
const PORT = config[node_env].PORT;
const MONGO_URI = config[node_env].MONGO_URI;

//Connect to mongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true });

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes server
app.use('/api', require('./routes/server'));

//Api running port
app.listen(PORT, () =>{
    console.log('Api-Backend-Noc port: ' + PORT);
});