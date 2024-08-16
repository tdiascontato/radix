// radix/node-radix/tests/src/routes/userRoutes.test.js
const request = require('supertest');
const express = require('express');
const { describe, it, beforeAll, afterAll, expect, afterEach} = require('@jest/globals');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('../../../src/routes/userRoutes');
const User = require('../../../src/models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

app.use(express.json());
app.use('/api/users', userRoutes);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterEach(async () => {
    await User.deleteMany({email: 'test@example.com',});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('User Routes', () => {
    describe('POST /api/users/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');
            expect(response.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should return error if registration fails', async () => {
            await request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            const response = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Failed to register user');
        });
    });

    describe('POST /api/users/login', () => {

        it('should return error if credentials are invalid', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });
    });
});
