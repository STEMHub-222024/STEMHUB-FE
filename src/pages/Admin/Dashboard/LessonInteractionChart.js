import { memo } from 'react';
import { Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const LessonInteractionChart = memo(({ data }) => (
    <BarChart width={800} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="comments" fill="#8884d8" />
    </BarChart>
));

export default LessonInteractionChart;
