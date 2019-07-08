const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('Logs', new Schema ({
    logs: { type: String }
}, { versionKey: false, timestamps: true }));