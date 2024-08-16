// radix/node-radix/src/routes/sensorRoutes.js
const express = require('express');
const multer = require('multer');

const { receiveData } = require('../controllers/realTimeDataController');
const { uploadCSV } = require('../controllers/csvUploadController');
const { getAverages } = require("../controllers/metricsController");

const router = express.Router();
// const auth = require('../middlewares/auth');

const upload = multer({ dest: 'uploads/' });

router.post('/data', receiveData);
router.post('/upload-csv', upload.single('file'), uploadCSV);
router.get('/averages', getAverages);

module.exports = router;
