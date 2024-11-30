import { memo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const LessonInteractionPieChart = memo(({ data }) => {
    const chartData = {
        labels: data.map((item) => item.name),
        datasets: [
            {
                label: 'Comments',
                data: data.map((item) => item.comments),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
        ],
    };

    const options = {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return <Pie data={chartData} options={options} width={280} height={280} />;
});

export default LessonInteractionPieChart;
