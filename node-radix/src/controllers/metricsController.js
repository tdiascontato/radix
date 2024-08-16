// radix/node-radix/src/controllers/metricsController.js
const { calculateAverages } = require('../services/metricsService');

exports.getAverages = async (req, res) => {
    const { period } = req.query;

    if (!period) {
        return res.status(400).json({ error: 'Period is required' });
    }

    const validPeriods = ['24h', '48h', '1w', '1m'];
    if (!validPeriods.includes(period)) {
        return res.status(400).json({ error: 'Invalid period specified' });
    }

    const now = new Date();
    let startDate;

    switch (period) {
        case '24h':
            startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            break;
        case '48h':
            startDate = new Date(now.getTime() - (48 * 60 * 60 * 1000));
            break;
        case '1w':
            startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            break;
        case '1m':
            startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            break;
    }

    try {
        const data = await calculateAverages(startDate);
        res.status(200).json({ averages: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
};