import { NextResponse } from "next/server";
import dbConnect from "@/libs/db";
import { Product } from "@/models/product.model";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all products for this user
    const allProducts = await Product.find({ owner: userId });
    
    // Get sold products (status: soldout)
    const soldProducts = allProducts.filter(product => product.status === "soldout");
    
    // Calculate total revenue from sold products
    const totalRevenue = soldProducts.reduce((sum, product) => sum + product.price, 0);
    
    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get previous month and year
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Filter products sold in current month
    const currentMonthSales = soldProducts.filter(product => {
      const soldDate = new Date(product.soldDate || product.updatedAt);
      return soldDate.getMonth() === currentMonth && soldDate.getFullYear() === currentYear;
    });
    
    // Filter products sold in previous month
    const prevMonthSales = soldProducts.filter(product => {
      const soldDate = new Date(product.soldDate || product.updatedAt);
      return soldDate.getMonth() === prevMonth && soldDate.getFullYear() === prevMonthYear;
    });
    
    // Calculate revenue for current and previous months
    const currentMonthRevenue = currentMonthSales.reduce((sum, product) => sum + product.price, 0);
    const prevMonthRevenue = prevMonthSales.reduce((sum, product) => sum + product.price, 0);
    
    // Calculate revenue change percentage
    const revenueChangePercentage = prevMonthRevenue === 0 
      ? 100 
      : ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
    
    // Get monthly sales data for the past 12 months
    const monthlySalesData = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentYear - Math.floor((currentMonth - i + 12) / 12) + 1;
      
      const monthSales = soldProducts.filter(product => {
        const soldDate = new Date(product.soldDate || product.updatedAt);
        return soldDate.getMonth() === monthIndex && soldDate.getFullYear() === year;
      });
      
      const monthName = new Date(year, monthIndex, 1).toLocaleString('default', { month: 'short' });
      
      monthlySalesData.unshift({
        month: monthName,
        sales: monthSales.length,
        revenue: monthSales.reduce((sum, product) => sum + product.price, 0)
      });
    }
    
    // Get product sales distribution data for pie chart
    const productSalesDistribution = soldProducts.reduce((acc: {[key: string]: {name: string, value: number, revenue: number}}, product) => {
      const productName = product.name;
      if (!acc[productName]) {
        acc[productName] = {
          name: productName,
          value: 1,
          revenue: product.price
        };
      } else {
        acc[productName].value += 1;
        acc[productName].revenue += product.price;
      }
      return acc;
    }, {});

    // Convert to array and sort by sales count (descending)
    const productSalesArray = Object.values(productSalesDistribution)
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      totalProducts: allProducts.length,
      activeListing: allProducts.filter(product => product.status === "active").length,
      draftListing: allProducts.filter(product => product.status === "draft").length,
      soldProducts: soldProducts.length,
      totalRevenue,
      currentMonthRevenue,
      prevMonthRevenue,
      revenueChangePercentage,
      monthlySalesData,
      productSalesDistribution: productSalesArray
    });
    
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}