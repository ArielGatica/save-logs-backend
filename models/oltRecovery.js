const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('oltRecovery', new Schema ({
    date: { type: Date },
    ip: { type: String},
    severity: { type: String },
    alarm_name: { type: String },
    frame_id: { type: Number },
    slot_id: { type: Number },
    port_id: { type: Number },
    ont_id: { type: Number },
    equipment_id: { type: String },
    olt_fault_id: { type: String }
}, { versionKey: false, timestamps: true, collection: 'olt_recovery' }));