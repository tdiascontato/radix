// radix/node-radix/tests/src/models/SensorData.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const SensorData = require('../../../src/models/SensorData');
const { describe, beforeAll, afterAll, beforeEach, it, expect } = require('@jest/globals');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('SensorData Model', () => {
    beforeEach(async () => {
        await SensorData.deleteMany({ equipmentId: /testEq\d+/ });
    });

    it('should save sensor data successfully', async () => {
        const equipmentId = 'testEq1';
        const timestamp = new Date();
        const value = 42.5;

        const sensorData = new SensorData({ equipmentId, timestamp, value });
        await sensorData.save();

        const savedData = await SensorData.findOne({ equipmentId });
        expect(savedData).not.toBeNull();
        expect(savedData.equipmentId).toBe(equipmentId);
        expect(savedData.timestamp).toEqual(timestamp);
        expect(savedData.value).toBe(value);
    });

    it('should require all fields', async () => {

        const sensorDataWithoutEquipmentId = new SensorData({ timestamp: new Date(), value: 99.9 });
        await expect(sensorDataWithoutEquipmentId.save()).rejects.toThrow(/SensorData validation failed/);

        const sensorDataWithoutTimestamp = new SensorData({ equipmentId: 'testEq3', value: 55.5 });
        await expect(sensorDataWithoutTimestamp.save()).rejects.toThrow(/SensorData validation failed/);
    });

    it('should use timestamps correctly', async () => {
        const equipmentId = 'testEq4';
        const timestamp = new Date();
        const value = 55.5;

        const sensorData = new SensorData({ equipmentId, timestamp, value });
        const savedData = await sensorData.save();

        expect(savedData.createdAt).toBeDefined();
        expect(savedData.updatedAt).toBeDefined();
        expect(savedData.createdAt).toEqual(savedData.updatedAt);
    });
});
