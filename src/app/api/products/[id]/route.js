import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req, { params }) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.orderItem.deleteMany({ where: { productId: params.id } });
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
