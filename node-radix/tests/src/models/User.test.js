// radix/node-radix/tests/src/models/User.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../../src/models/User');
const bcrypt = require('bcryptjs');
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

describe('User Model', () => {
    beforeEach(async () => {
        await User.deleteMany({ email: /test@example\.com|test2@example\.com/ });
    });

    it('should hash the password before saving', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        const user = new User({ email, password });
        await user.save();

        const savedUser = await User.findOne({ email });
        expect(savedUser).not.toBeNull();
        expect(await bcrypt.compare(password, savedUser.password)).toBe(true);
    });

    it('should compare passwords correctly', async () => {
        const email = 'test2@example.com';
        const password = 'password123';

        const user = new User({ email, password });
        await user.save();

        const isMatch = await user.comparePassword(password);
        expect(isMatch).toBe(true);
    });

    it('should throw an error if email is not unique', async () => {
        const email = 'duplicate@example.com';
        const password = 'password123';

        const user1 = new User({ email, password });
        await user1.save();

        const user2 = new User({ email, password });

        await expect(user2.save()).rejects.toThrowError(/E11000 duplicate key error/);
    });
});
