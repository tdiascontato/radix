// radix/node-radix/tests/src/routes/sensorRoutes.test.js
const request = require('supertest');
const express = require('express');
const multer = require('multer');
const { describe, it, beforeAll, afterAll, expect, afterEach } = require('@jest/globals');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = express();
const sensorRoutes = require('../../../src/routes/sensorRoutes');
const fs = require('fs');
const path = require('path');
const User = require("../../../src/models/User");

app.use(express.json());
app.use('/api/sensors', sensorRoutes);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await User.deleteMany({ sensorId: '123' });
    await mongoose.disconnect();
    await mongoServer.stop();
});

jest.mock('../../../src/controllers/realTimeDataController', () => ({
    receiveData: jest.fn((req, res) => res.status(200).json({ message: 'Data received' })),
    uploadCSV: jest.fn((req, res) => res.status(200).json({ message: 'File uploaded' })),
    getAverages: jest.fn((req, res) => res.status(200).json({ averages: { temperature: 22.5 } }))
}));

describe('Sensor Routes', () => {
    describe('POST /api/sensors/data', () => {
        it('should receive sensor data', async () => {
            const response = await request(app)
                .post('/api/sensors/data')
                .send({
                    sensorId: '123',
                    temperature: 22.5
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Data received');
        });
    });

    describe('POST /api/sensors/upload-csv', () => {
        it('should upload a CSV file', async () => {
            const filePath = path.join(__dirname, 'test.csv');
            fs.writeFileSync(filePath, 'equipmentId,timestamp,value\n123,2024-08-15T12:00:00Z,22.5'); // Atualizado para incluir equipmentId

            const response = await request(app)
                .post('/api/sensors/upload-csv')
                .attach('file', filePath);

            expect(response.status).toBe(201); // Espera-se que o status seja 201 para sucesso na criação
            expect(response.body.message).toBe('CSV data saved successfully');  // Mensagem do controlador

            fs.unlinkSync(filePath);
        });
    });


    // describe('GET /api/sensors/averages', () => {
    //     it('should get average values', async () => {
    //         const response = await request(app)
    //             .get('/api/sensors/averages')
    //             .query({ period: '24h' });
    //         console.log(response.body)
    //         expect(response.status).toBe(200);
    //         expect(response.body.averages[0]).toHaveProperty('_id', '123');
    //     });
    // });
});
