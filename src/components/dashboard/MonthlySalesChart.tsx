import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlySalesData {
  month: string;
  sales: number;
  revenue: number;
}

interface MonthlySalesChartProps {
  data: MonthlySalesData[];
}

const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Sales & Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" name="Sales" fill="#8884d8" />
          <Bar dataKey="revenue" name="Revenue" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySalesChart;