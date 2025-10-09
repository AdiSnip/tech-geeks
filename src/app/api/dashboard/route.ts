import { NextResponse } from 'next/server';
import dbConnect from '@/libs/db';
import { Product } from '@/models/product.model';

export async function GET() {
  try {
    await dbConnect();

    // Dummy data for now. In a real application, you would fetch and calculate these values from your database.
    const totalProducts = await Product.countDocuments();
    const activeListings = await Product.countDocuments({ status: 'active' });
    const draftListings = await Product.countDocuments({ status: 'draft' });
    
    // Calculate totalSoldProductsCount
    const allProducts = await Product.find({});
    let totalSoldProductsCount = 0;
    allProducts.forEach(product => {
      if (product.soldDate) {
        totalSoldProductsCount += product.soldDate.length;
      }
    });

    const monthlySalesData = [
      { name: 'Jan', sales: 4000, revenue: 2400 },
      { name: 'Feb', sales: 3000, revenue: 1398 },
      { name: 'Mar', sales: 2000, revenue: 9800 },
      { name: 'Apr', sales: 2780, revenue: 3908 },
      { name: 'May', sales: 1890, revenue: 4800 },
      { name: 'Jun', sales: 2390, revenue: 3800 },
      { name: 'Jul', sales: 3490, revenue: 4300 },
    ];

    const monthlyRevenueComparison = {
      currentMonthRevenue: 12500,
      previousMonthRevenue: 10000,
    };

    const productSalesDistribution = [
      { name: 'Electronics', value: 400 },
      { name: 'Books', value: 300 },
      { name: 'Home Goods', value: 300 },
      { name: 'Clothing', value: 200 },
    ];

    return NextResponse.json({
      totalProducts,
      activeListings,
      draftListings,
      totalSoldProductsCount,
      monthlySalesData,
      monthlyRevenueComparison,
      productSalesDistribution,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ message: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}