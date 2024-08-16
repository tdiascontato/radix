// radix/next-radix/src/app/dashboard/page.js
"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSensorAverages } from '../datas/api';
import { Line } from 'react-chartjs-2';
import styles from '../styles/dashboard.module.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const [period, setPeriod] = useState('24h');
    const [chartData, setChartData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSensorAverages(period);
                console.log(data);

                const sortedData = data.averages.sort((a, b) => a._id.localeCompare(b._id));

                const formattedData = sortedData.map((entry) => ({
                    timestamp: entry._id,
                    average: entry.averageValue
                }));

                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching sensor data:", error);
            }
        };

        fetchData();
    }, [period]);

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    const renderChart = () => {
        if (!chartData) {
            return <p>Loading...</p>;
        }

        const labels = chartData.map((entry) => entry.timestamp);
        const values = chartData.map((entry) => entry.average);

        const data = {
            labels,
            datasets: [
                {
                    label: `Average Sensor Value (${period})`,
                    data: values,
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(75,192,192,1)',
                },
            ],
        };

        return <Line data={data} />;
    };

    return (
        <main className={styles.main_dashboard}>
            <h1>Sensor Dashboard</h1>
            <button onClick={() => router.push('/')} className={styles.backButton_dashboard}>Voltar para Home</button>
            <ul className={styles.periodOptions_dashboard}>
                <li onClick={() => handlePeriodChange('24h')} className={period === '24h' ? styles.active : ''}>Últimas
                    24 horas
                </li>
                <li onClick={() => handlePeriodChange('48h')} className={period === '48h' ? styles.active : ''}>Últimas
                    48 horas
                </li>
                <li onClick={() => handlePeriodChange('1w')} className={period === '1w' ? styles.active : ''}>Última
                    semana
                </li>
                <li onClick={() => handlePeriodChange('1m')} className={period === '1m' ? styles.active : ''}>Último
                    mês
                </li>
            </ul>
            <div className={styles.chartContainer_dashboard}>
                {renderChart()}
            </div>
        </main>
    );
}
