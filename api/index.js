const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
const cors = require('cors');

//Environment var
const node_env = process.env.NODE_ENV || 'dev';
const PORT = config[node_env].PORT;
const MONGO_URI = config[node_env].MONGO_URI;

//Connect to mongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false });

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())

//Routes server
app.use('/api', require('./routes/server'));

//Api running port
app.listen(PORT, () =>{
    console.log('Api-Backend-Noc port: ' + PORT);
});

app.get('/', (req, res) =>{
    res.status(200).send(':)');
})