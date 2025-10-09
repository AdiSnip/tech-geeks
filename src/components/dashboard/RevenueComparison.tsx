import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface RevenueComparisonProps {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
}

const RevenueComparison: React.FC<RevenueComparisonProps> = ({
  currentMonthRevenue,
  previousMonthRevenue,
}) => {
  const percentageChange = previousMonthRevenue === 0
    ? (currentMonthRevenue > 0 ? 100 : 0)
    : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

  const isIncrease = percentageChange >= 0;
  const changeIcon = isIncrease ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  const changeColorClass = isIncrease ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Comparison</h3>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-gray-500">Current Month</p>
          <p className="text-xl font-bold">${currentMonthRevenue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Previous Month</p>
          <p className="text-xl font-bold">${previousMonthRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <span className={`text-sm font-medium ${changeColorClass} flex items-center`}>
          {changeIcon} {Math.abs(percentageChange).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default RevenueComparison;