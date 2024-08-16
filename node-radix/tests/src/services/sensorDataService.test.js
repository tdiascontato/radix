// radix/node-radix/tests/src/services/sensorDataService.test.js
const mongoose = require('mongoose');
const SensorData = require('../../../src/models/SensorData');
const sensorDataService = require('../../../src/services/sensorDataService');
require('dotenv').config();
const { describe, beforeAll, afterAll, beforeEach, it, expect } = require('@jest/globals');

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('sensorDataService', () => {
    beforeEach(async () => {
        await SensorData.deleteMany({ equipmentId: /testEquip\d+/ });
    });

    it('should save sensor data successfully', async () => {
        const equipmentId = 'testEquip1';
        const timestamp = new Date('2024-01-01T10:00:00Z');
        const value = 42;

        const savedData = await sensorDataService.saveSensorData(equipmentId, timestamp, value);

        expect(savedData).toHaveProperty('_id');
        expect(savedData.equipmentId).toBe(equipmentId);
        expect(savedData.timestamp.toISOString()).toBe(timestamp.toISOString());
        expect(savedData.value).toBe(value);
    });
});
