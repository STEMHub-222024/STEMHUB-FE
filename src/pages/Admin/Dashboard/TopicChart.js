import { memo, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopicChart = memo(({ data }) => {
    const colors = ['#ff6384', '#36a2eb', '#ffce56', '#82ca9d', '#ff9f40', '#4bc0c0', '#9966ff', '#c9cbcf'];

    const [legendPosition, setLegendPosition] = useState('left');

    useEffect(() => {
        const updateLegendPosition = () => {
            setLegendPosition(window.innerWidth <= 768 ? 'top' : 'left');
        };

        updateLegendPosition();
        window.addEventListener('resize', updateLegendPosition);
        return () => window.removeEventListener('resize', updateLegendPosition);
    }, []);

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
                position: legendPosition,
                fullSize: true,
            },
            tooltip: {
                enabled: true,
            },
        },
        aspectRatio: 1 / 1,
    };

    return <Pie data={chartData} options={options} width={348} height={348} />;
});

export default TopicChart;
