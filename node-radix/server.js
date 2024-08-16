// radix/node-radix/server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const sensorRoutes = require('./src/routes/sensorRoutes');
const userRoutes = require('./src/routes/userRoutes')

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB', err);
});


app.use('/api/sensors', sensorRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
