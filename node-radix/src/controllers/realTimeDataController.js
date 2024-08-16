// radix/node-radix/controllers/realTimeDataController.js
const { saveSensorData } = require('../services/sensorDataService');

exports.receiveData = async (req, res) => {
    const { equipmentId, timestamp, value } = req.body;

    try {
        await saveSensorData(equipmentId, timestamp, value);
        res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save data' });
    }
};
