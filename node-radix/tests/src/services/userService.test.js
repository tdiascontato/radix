// radix/node-radix/tests/src/services/userService.test.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../../src/models/User');
require('dotenv').config();
const userService = require('../../../src/services/userService');
const { describe, beforeAll, afterAll, beforeEach, it, expect } = require('@jest/globals');

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL);
});

afterAll(async () => {
    await mongoose.connection.close(); // Fechar a conexão com o banco de dados
});

describe('userService', () => {
    beforeEach(async () => {
        await User.deleteMany({ email: /test\d+@example\.com/ }); // Limpar usuários de teste
    });

    it('should register a user successfully', async () => {
        const email = 'test1@example.com'; // Usar email único
        const password = 'password123';

        const user = await userService.registerUser(email, password);

        expect(user).toHaveProperty('_id');
        expect(user.email).toBe(email);
        expect(await user.comparePassword(password)).toBe(true);
    });

    it('should authenticate a user successfully', async () => {
        const email = 'test2@example.com'; // Usar email único
        const password = 'password456';

        // Registrar o usuário
        await userService.registerUser(email, password);

        // Autenticar o usuário
        const { user, token } = await userService.authenticateUser(email, password);

        expect(user).toHaveProperty('_id');
        expect(user.email).toBe(email);
        expect(token).toBeDefined();
        expect(jwt.verify(token, process.env.JWT_SECRET)).toBeTruthy(); // Verificar se o token é válido
    });

    it('should throw an error for invalid credentials', async () => {
        const email = 'invalid@example.com';
        const password = 'wrongpassword';

        // Tentar autenticar com credenciais inválidas
        await expect(userService.authenticateUser(email, password)).rejects.toThrow('Invalid credentials');
    });
});
