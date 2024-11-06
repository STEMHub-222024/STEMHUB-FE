import { memo } from 'react';
import { Line } from 'react-chartjs-2'; // Change this line to import Line instead of Bar
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const SearchChart = memo(({ searchData = [] }) => {

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
        labels: searchData.map(item => item.searchKeyword || 'No keywords'),
        datasets: [{
            label: 'Number of searches',
            data: searchData.map(item => item.searchCount || 0), 
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: colors.slice(0, searchData.length), 
            borderWidth: 2, 
            fill: true, 
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

    return <Line data={chartData} options={options} />; // Change Bar to Line here
});

export default SearchChart;