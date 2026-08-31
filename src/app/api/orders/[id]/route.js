import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: body.status }
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
