// radix/node-radix/src/services/sensorDataService.js
const SensorData = require('../models/SensorData');

exports.saveSensorData = async (equipmentId, timestamp, value) => {
    try {
        const sensorData = new SensorData({ equipmentId, timestamp, value });
        await sensorData.save();
        return sensorData;
    } catch (error) {
        console.error('Error saving sensor data:', error);
        throw error;
    }
};
