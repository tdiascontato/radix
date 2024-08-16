// radix/node-radix/src/services/userService.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerUser = async (email, password) => {
    const user = new User({ email, password });
    await user.save();
    return user;
};

exports.authenticateUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
};
