const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('AlarmsDictionary', new Schema({
    fault: { type: String },
    recovery: { type: String }
}, { timestamps: true, versionKey: false, collection: 'alarms_dictionary' } ));