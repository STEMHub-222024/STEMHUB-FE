import { memo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopicChart = memo(({ data }) => {
    const colors = ['#ff6384', '#36a2eb', '#ffce56', '#82ca9d', '#ff9f40', '#4bc0c0', '#9966ff', '#c9cbcf'];

    const chartData = {
        labels: data.map((item) => item.name),
        datasets: [
            {
                label: 'Top views',
                data: data.map((item) => item.views),
                backgroundColor: colors.slice(0, data.length),
            },
        ],
    };

    const options = {
        responsive: false,
        plugins: {
            legend: {
                position: 'bottom',
                fullSize: true,
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return <Pie data={chartData} options={options} width={280} height={280} />;
});

export default TopicChart;
