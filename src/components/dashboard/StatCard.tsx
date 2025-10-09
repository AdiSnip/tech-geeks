import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number | undefined | null; // ✅ allow undefined/null
  icon: LucideIcon;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
}) => {
  const changeColorClass = {
    increase: 'text-green-500',
    decrease: 'text-red-500',
    neutral: 'text-gray-500',
  }[changeType];

  // ✅ Format number if value is a number, fallback to 0
  const displayValue =
    typeof value === 'number' ? `$${value.toFixed(2)}` : value ?? 'N/A';

  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
        {change && <p className={`text-sm ${changeColorClass}`}>{change}</p>}
      </div>
      <div className="text-gray-400">
        <Icon size={28} />
      </div>
    </div>
  );
};

export default StatCard;
