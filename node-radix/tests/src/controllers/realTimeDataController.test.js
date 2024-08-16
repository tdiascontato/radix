// radix/node-radix/tests/src/controllers/realTimeDataController.test.js
const request = require('supertest');
const express = require('express');
const { receiveData } = require('../../../src/controllers/realTimeDataController');
const { saveSensorData } = require('../../../src/services/sensorDataService');
const {describe, it, expect} = require("@jest/globals");

jest.mock('../../../src/services/sensorDataService');

const app = express();
app.use(express.json());
app.post('/data', receiveData);

describe('POST /data', () => {
    it('should save data and respond with success', async () => {
        const mockData = { equipmentId: 'sensor1', timestamp: new Date().toISOString(), value: 25.5 };

        saveSensorData.mockResolvedValue(true);

        const response = await request(app)
            .post('/data')
            .send(mockData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Data saved successfully');
        expect(saveSensorData).toHaveBeenCalledWith(mockData.equipmentId, mockData.timestamp, mockData.value);
    });

    it('should handle errors from saveSensorData', async () => {
        const mockData = { equipmentId: 'sensor1', timestamp: new Date().toISOString(), value: 25.5 };

        saveSensorData.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/data')
            .send(mockData);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to save data');
    });
});
