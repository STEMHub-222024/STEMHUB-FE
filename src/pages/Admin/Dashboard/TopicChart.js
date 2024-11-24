import { memo } from 'react';
import { Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const TopicChart = memo(({ data }) => (
    <ResponsiveContainer height="80%">
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#82ca9d" />
        </BarChart>
    </ResponsiveContainer>
));

export default TopicChart;
