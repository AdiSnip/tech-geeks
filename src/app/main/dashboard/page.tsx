"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import StatCard from "@/components/dashboard/StatCard";
import RevenueComparison from "@/components/dashboard/RevenueComparison";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import ProductSalesPieChart from "@/components/dashboard/ProductSalesPieChart";

interface DashboardData {
  totalProducts: number;
  activeListing: number;
  draftListing: number;
  soldProducts: number;
  totalRevenue: number;
  currentMonthRevenue: number;
  prevMonthRevenue: number;
  revenueChangePercentage: number;
  monthlySalesData: {
    month: string;
    sales: number;
    revenue: number;
  }[];
  productSalesDistribution: {
    name: string;
    value: number;
    revenue: number;
  }[];
}

const Page = () => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard?userId=${user._id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="h-full w-full bg-amber-50 p-4 flex items-center justify-center">
        <div className="text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full bg-amber-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-amber-50 p-4">
      <h1 className="text-3xl font-bold mb-6">
        {user ? `Welcome, ${user.name}!` : "Loading..."}
      </h1>

      {dashboardData && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Total Products" 
              value={dashboardData.totalProducts} 
              bgColor="bg-blue-50"
            />
            <StatCard 
              title="Active Listings" 
              value={dashboardData.activeListing} 
              bgColor="bg-green-50"
            />
            <StatCard 
              title="Products Sold" 
              value={dashboardData.soldProducts} 
              bgColor="bg-purple-50"
            />
            <StatCard 
              title="Total Revenue" 
              value={`$${dashboardData.totalRevenue.toFixed(2)}`} 
              bgColor="bg-yellow-50"
            />
          </div>

          {/* Revenue Comparison and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-1">
              <RevenueComparison 
                currentMonthRevenue={dashboardData.currentMonthRevenue}
                prevMonthRevenue={dashboardData.prevMonthRevenue}
                changePercentage={dashboardData.revenueChangePercentage}
              />
            </div>
            <div className="lg:col-span-2">
              <MonthlySalesChart data={dashboardData.monthlySalesData} />
            </div>
          </div>
          
          {/* Product Sales Distribution Pie Chart */}
          <div className="mb-6">
            <ProductSalesPieChart data={dashboardData.productSalesDistribution || []} />
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
