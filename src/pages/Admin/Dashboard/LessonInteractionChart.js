import { memo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';

const cx = classNames.bind(styles);


ChartJS.register(ArcElement, Title, Tooltip, Legend);

const LessonInteractionPieChart = memo(({ data }) => {
    const chartData = {
        labels: data.map(item => item.name),
        datasets: [{
            label: 'Comments',
            data: data.map(item => item.comments),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
            ],
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <div className={cx("chart-container")}> 
            <Pie data={chartData} options={options} />
        </div>
    );
});

export default LessonInteractionPieChart;