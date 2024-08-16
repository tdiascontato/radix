// radix/node-radix/models/SensorData.js
const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    equipmentId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    value: { type: Number }
}, { collection: 'Sensors', timestamps: true });

module.exports = mongoose.model('SensorData', sensorDataSchema);
