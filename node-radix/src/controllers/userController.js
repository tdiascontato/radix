// radix/node-radix/src/controllers/userController.js
const { registerUser, authenticateUser } = require('../services/userService');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await registerUser(email, password);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: 'Failed to register user' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { user, token } = await authenticateUser(email, password);
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};
