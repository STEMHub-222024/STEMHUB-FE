import { memo } from 'react';
import { Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const LessonInteractionChart = memo(({ data }) => (
    <ResponsiveContainer height="80%">
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="comments" fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
));

export default LessonInteractionChart;
