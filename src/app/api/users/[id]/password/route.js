import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req, { params }) {
  try {
    const { currentPassword, newPassword } = await req.json();
    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return NextResponse.json({ error: 'Current password is wrong' }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: params.id },
      data: { password: bcrypt.hashSync(newPassword, 10) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
