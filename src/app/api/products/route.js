import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { applyDiscountFields } from '../../../lib/pricing';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const onSale = searchParams.get('onSale');
    const where = {};
    if (category && category !== 'All') where.category = category;
    if (onSale === 'true') where.onSale = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    const products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products. Check DATABASE_URL.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const deal = applyDiscountFields(body);
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || '',
        stock: parseInt(body.stock, 10) || 10,
        category: body.category || 'General',
        image: body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        featured: !!body.featured,
        ...deal
      }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create' }, { status: 500 });
  }
}
