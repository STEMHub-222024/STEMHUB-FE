import { memo } from 'react';
import { Tooltip, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const UserChart = memo(({ data }) => (
    <ResponsiveContainer height="80%">
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
    </ResponsiveContainer>
));

export default UserChart;
