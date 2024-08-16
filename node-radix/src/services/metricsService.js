// radix/node-radix/src/services/metricsService.js
const SensorData = require('../models/SensorData');

exports.calculateAverages = async (startDate) => {
    return SensorData.aggregate([
        {$match: {timestamp: {$gte: startDate}}},
        {$group: {_id: '$equipmentId', averageValue: {$avg: '$value'}}}
    ]);
};
