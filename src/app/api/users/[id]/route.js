import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req, { params }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, city: true, theme: true }
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: body.name,
        phone: body.phone || null,
        address: body.address || null,
        city: body.city || null,
        theme: body.theme || 'dark'
      },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, city: true, theme: true }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
