// radix/node-radix/tests/index.test.js
const request = require('supertest');
const app = require('../server.js');
const mongoose = require('mongoose');
const { describe, it, afterAll, expect } = require('@jest/globals');

describe('Server Initialization', () => {
    it('Should start the server and respond with basic request 404', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(404); // Não tem nada em '/'
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
