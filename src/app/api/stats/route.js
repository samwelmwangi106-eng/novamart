import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const [totalProducts, totalOrders, totalUsers, rev] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true } })
    ]);
    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: rev._sum.totalAmount || 0
    });
  } catch (error) {
    return NextResponse.json({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0, error: error.message });
  }
}
