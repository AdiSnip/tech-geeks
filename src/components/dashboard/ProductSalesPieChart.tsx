import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProductSalesData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface ProductSalesPieChartProps {
  data: ProductSalesData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF69B4', '#8A2BE2'];

const ProductSalesPieChart: React.FC<ProductSalesPieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow h-full flex items-center justify-center">
        <p className="text-gray-500">No product sales data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Product Sales Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductSalesPieChart;