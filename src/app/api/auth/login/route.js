import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      theme: user.theme
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
