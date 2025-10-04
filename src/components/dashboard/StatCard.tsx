"use client";

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change,
  bgColor = "bg-white" 
}) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-4 flex flex-col`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {change !== undefined && (
        <div className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
          <span className="text-gray-400 ml-1">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;