"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ProductSalesData {
  name: string;
  value: number;
  revenue: number;
}

interface ProductSalesPieChartProps {
  data: ProductSalesData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57'];

const ProductSalesPieChart: React.FC<ProductSalesPieChartProps> = ({ data }) => {
  // Limit to top 8 products for better visualization
  const displayData = data.slice(0, 8);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-full">
      <h3 className="text-lg font-semibold mb-4">Product Sales Distribution</h3>
      
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No sales data available</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any, props: any) => [`${value} sold`, props.payload.name]}
                labelFormatter={() => 'Product Sales'}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ProductSalesPieChart;