const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('oltRecovery', new Schema ({
    date: { type: Date },
    ip: { type: String},
    severity: { type: String },
    alarm_name: { type: String },
    frame_id: { type: String },
    slot_id: { type: String },
    port_id: { type: String },
    ont_id: { type: String },
    equipment_id: { type: String },
    olt_fault_id: { type: String }
}, { versionKey: false, timestamps: true, collection: 'olt_recovery' }));