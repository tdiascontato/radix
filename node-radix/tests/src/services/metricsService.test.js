// radix/node-radix/tests/src/services/metricsService.test.js
const mongoose = require('mongoose');
const SensorData = require('../../../src/models/SensorData');
const { calculateAverages } = require('../../../src/services/metricsService');
require('dotenv').config();
const { describe, beforeAll, afterAll, beforeEach, it, expect } = require('@jest/globals');

const testData = [
    { equipmentId: 'equip1', timestamp: new Date('2024-01-01T10:00:00Z'), value: 10 },
    { equipmentId: 'equip1', timestamp: new Date('2024-01-01T11:00:00Z'), value: 20 },
    { equipmentId: 'equip2', timestamp: new Date('2024-01-01T10:00:00Z'), value: 30 },
    { equipmentId: 'equip2', timestamp: new Date('2024-01-01T11:00:00Z'), value: 40 },
];


beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('metricsService', () => {
    beforeEach(async () => {
        await SensorData.deleteMany({ equipmentId: /equip\d+/ });
    });

    it('should calculate the average values for each equipmentId', async () => {

        await SensorData.insertMany(testData);

        const startDate = new Date('2024-01-01T00:00:00Z');
        const averages = await calculateAverages(startDate);

        expect(averages).toBeInstanceOf(Array);
        expect(averages.length).toBeGreaterThan(1);

        const equip1 = averages.find(a => a._id === 'equip1');
        const equip2 = averages.find(a => a._id === 'equip2');

        expect(equip1).toBeDefined();
        expect(equip2).toBeDefined();

        expect(equip1.averageValue).toBeCloseTo(15, 1);
        expect(equip2.averageValue).toBeCloseTo(35, 1);
    });
});
