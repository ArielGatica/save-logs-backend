const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('OltCommands', new Schema({
    date: { type: Date },
    ip_olt: { type: String },
    ip: { type: String },
    user: { type: String },
    command: { type: String }
}, { versionKey: false, timestamps: true } ));