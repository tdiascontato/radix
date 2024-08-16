// radix/node-radix/tests/src/controllers/metricsController.test.js
const request = require('supertest');
const express = require('express');
const { getAverages } = require('../../../src/controllers/metricsController');
const { calculateAverages } = require('../../../src/services/metricsService');
const {describe, it, expect} = require("@jest/globals");

jest.mock('../../../src/services/metricsService');

const app = express();
app.use(express.json());
app.get('/averages', getAverages);

describe('GET /averages', () => {
    it('should return 400 if period is not provided', async () => {
        const response = await request(app).get('/averages');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Period is required');
    });

    it('should return 400 for invalid period', async () => {
        const response = await request(app).get('/averages?period=invalid');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid period specified');
    });

    it('should return averages for valid period', async () => {
        const mockData = [
            { _id: 'sensor1', averageValue: 50.0 },
            { _id: 'sensor2', averageValue: 75.0 }
        ];
        calculateAverages.mockResolvedValue(mockData);

        const response = await request(app).get('/averages?period=24h');
        expect(response.status).toBe(200);
        expect(response.body.averages).toEqual(mockData);
    });

    it('should handle errors from calculateAverages', async () => {
        calculateAverages.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/averages?period=24h');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to retrieve data');
    });
});
