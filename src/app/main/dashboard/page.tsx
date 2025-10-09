"use client";

import React, { useEffect, useState } from 'react';
import { Package, CheckCircle, Edit3, ShoppingCart, DollarSign } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RevenueComparison from '@/components/dashboard/RevenueComparison';
import MonthlySalesChart from '@/components/dashboard/MonthlySalesChart';
import ProductSalesPieChart from '@/components/dashboard/ProductSalesPieChart';

interface MonthlySalesData {
  month: string;
  sales: number;
  revenue: number;
}

interface DashboardProductSalesData {
  name: string;
  sales: number;
  revenue: number;
}

interface DashboardData {
  totalProducts: number;
  activeListings: number;
  draftListings: number;
  totalSoldProductsCount: number;
  totalRevenue: number;
  monthlySalesData: MonthlySalesData[];
  monthlyRevenueComparison: {
    currentMonthRevenue: number;
    previousMonthRevenue: number;
  };
  productSalesDistribution: DashboardProductSalesData[];
}

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-gray-500 text-center mt-8">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="text-gray-500 text-center mt-8">No dashboard data available.</div>;
  }

  // ✅ Map DashboardProductSalesData to ProductSalesPieChartData
  const pieChartData = dashboardData.productSalesDistribution.map(item => ({
    name: item.name,
    value: item.sales
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
<StatCard title="Total Products" value={dashboardData.totalProducts} icon={Package} />
<StatCard title="Active Listings" value={dashboardData.activeListings} icon={CheckCircle} />
<StatCard title="Draft Listings" value={dashboardData.draftListings} icon={Edit3} />
<StatCard title="Products Sold" value={dashboardData.totalSoldProductsCount} icon={ShoppingCart} />
<StatCard title="Total Revenue" value={dashboardData.totalRevenue} icon={DollarSign} />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <MonthlySalesChart data={dashboardData.monthlySalesData} />
        <RevenueComparison
          currentMonthRevenue={dashboardData.monthlyRevenueComparison.currentMonthRevenue}
          previousMonthRevenue={dashboardData.monthlyRevenueComparison.previousMonthRevenue}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <ProductSalesPieChart data={pieChartData} />
      </div>
    </div>
  );
};

export default DashboardPage;
