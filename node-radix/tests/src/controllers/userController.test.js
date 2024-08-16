// radix/node-radix/tests/src/controllers/userController.test.js
const request = require('supertest');
const express = require('express');
const { register, login } = require('../../../src/controllers/userController');
const { registerUser, authenticateUser } = require('../../../src/services/userService');
const {describe, it, expect} = require("@jest/globals");

jest.mock('../../../src/services/userService');

const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);

describe('User Controller', () => {
    describe('POST /register', () => {
        it('should register a user and respond with success', async () => {
            const mockUser = { email: 'test@example.com', password: 'password123' };
            const savedUser = { ...mockUser, _id: 'userId' };

            registerUser.mockResolvedValue(savedUser);

            const response = await request(app)
                .post('/register')
                .send(mockUser);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');
            expect(response.body.user).toEqual(savedUser);
            expect(registerUser).toHaveBeenCalledWith(mockUser.email, mockUser.password);
        });

        it('should handle errors from registerUser', async () => {
            const mockUser = { email: 'test@example.com', password: 'password123' };

            registerUser.mockRejectedValue(new Error('Registration error'));

            const response = await request(app)
                .post('/register')
                .send(mockUser);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Failed to register user');
        });
    });

    describe('POST /login', () => {
        it('should log in a user and respond with success', async () => {
            const mockCredentials = { email: 'test@example.com', password: 'password123' };
            const user = { email: 'test@example.com', _id: 'userId' };
            const token = 'jwtToken';

            authenticateUser.mockResolvedValue({ user, token });

            const response = await request(app)
                .post('/login')
                .send(mockCredentials);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.user).toEqual(user);
            expect(response.body.token).toBe(token);
            expect(authenticateUser).toHaveBeenCalledWith(mockCredentials.email, mockCredentials.password);
        });

        it('should handle errors from authenticateUser', async () => {
            const mockCredentials = { email: 'test@example.com', password: 'password123' };

            authenticateUser.mockRejectedValue(new Error('Invalid credentials'));

            const response = await request(app)
                .post('/login')
                .send(mockCredentials);

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });
    });
});
