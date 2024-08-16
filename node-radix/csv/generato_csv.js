const fs = require('fs');
const path = require('path');
const { formatISO } = require('date-fns');

const numEquipments = 20;
const hoursInDay = 24;
const daysInMonth = 31;

const generateRandomValue = () => (Math.random() * (25 - 20) + 20).toFixed(1);

const generateCSV = () => {
    const filePath = path.join(__dirname, 'sensor_data.csv');
    const writeStream = fs.createWriteStream(filePath);

    writeStream.write('equipmentId,timestamp,value\n');

    for (let day = 1; day <= daysInMonth; day++) {
        for (let hour = 0; hour < hoursInDay; hour++) {
            for (let equipmentId = 1; equipmentId <= numEquipments; equipmentId++) {
                const timestamp = new Date(`2024-08-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:00:00Z`);
                writeStream.write(`${equipmentId.toString().padStart(3, '0')},${formatISO(timestamp, { representation: 'complete' })},${generateRandomValue()}\n`);
            }
        }
    }

    writeStream.end();
    console.log('CSV file generated:', filePath);
};

generateCSV();
