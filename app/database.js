const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/Logs';

mongoose.connect(URI, {useNewUrlParser: true}, (err, db) =>{
    /*if(!err)
        console.log("MongoDB is connected")
    else
        console.log("MongoDB error: ", err)*/
});

module.exports = mongoose;