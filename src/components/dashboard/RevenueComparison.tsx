"use client";

import React from 'react';

interface RevenueComparisonProps {
  currentMonthRevenue: number;
  prevMonthRevenue: number;
  changePercentage: number;
}

const RevenueComparison: React.FC<RevenueComparisonProps> = ({
  currentMonthRevenue,
  prevMonthRevenue,
  changePercentage
}) => {
  const isPositive = changePercentage >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Revenue Comparison</h3>
      
      <div className="flex justify-between mb-6">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Last Month</p>
          <p className="text-xl font-bold">${prevMonthRevenue.toFixed(2)}</p>
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 text-sm">Current Month</p>
          <p className="text-xl font-bold">${currentMonthRevenue.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center">
        <div className={`text-center ${isPositive ? 'text-green-500' : 'text-red-500'} font-medium`}>
          <span className="text-2xl mr-1">{isPositive ? '↑' : '↓'}</span>
          <span className="text-lg">{Math.abs(changePercentage).toFixed(1)}%</span>
          <p className="text-gray-500 text-sm mt-1">
            {isPositive ? 'Increase' : 'Decrease'} from last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueComparison;