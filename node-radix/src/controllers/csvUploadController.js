// radix/node-radix/src/controllers/csvUploadController.js
const csv = require('csv-parser');
const fs = require('fs');
const { saveSensorData } = require('../services/sensorDataService');

exports.uploadCSV = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const row of results) {
                    const { equipmentId, timestamp, value } = row;

                    if (!equipmentId) {
                        throw new Error('equipmentId is missing');
                    }

                    await saveSensorData(equipmentId, new Date(timestamp), parseFloat(value));
                }
                res.status(201).json({ message: 'CSV data saved successfully' });

            } catch (error) {
                console.error('Error saving CSV data:', error);
                res.status(500).json({ error: 'Failed to save CSV data' });

            } finally {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }
        });
};
