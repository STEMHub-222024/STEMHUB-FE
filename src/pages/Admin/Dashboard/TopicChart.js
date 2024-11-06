import { memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopicChart = memo(({ data }) => {

    const colors = [
        '#ff6384', 
        '#36a2eb', 
        '#ffce56',
        '#82ca9d', 
        '#ff9f40', 
        '#4bc0c0', 
        '#9966ff', 
        '#c9cbcf',
    ];

    const chartData = {
        labels: data.map(item => item.name),
        datasets: [{
            label: 'Top views',
            data: data.map(item => item.views),
            backgroundColor: colors.slice(0, data.length),
        }],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return <Bar data={chartData} options={options} />;
});

export default TopicChart;