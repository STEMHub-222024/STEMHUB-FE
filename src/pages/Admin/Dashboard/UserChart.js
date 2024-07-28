import { memo } from 'react';
import { Tooltip, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';

const UserChart = memo(({ data }) => (
    <LineChart width={800} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
    </LineChart>
));

export default UserChart;
