import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validateRegistration } from '@/lib/validation/schemas';
import { emailService } from '@/lib/email/service';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Validate input
    const validation = validateRegistration(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Send welcome email (non-blocking)
    emailService.sendWelcomeEmail(email, name).catch(err => 
      console.error('Welcome email failed:', err)
    );

    return NextResponse.json({
      message: 'Registration successful',
      user
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
