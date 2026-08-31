import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validateOrder } from '@/lib/validation/schemas';
import { calculateOrderTotals } from '@/lib/currency/format';
import { emailService } from '@/lib/email/service';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Get authenticated user (adjust based on your auth setup)
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      items,
      shippingName,
      shippingPhone,
      shippingCounty,
      shippingTown,
      shippingAddress,
      paymentMethod = 'COD'
    } = body;

    // Validate order data
    const validation = validateOrder(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Calculate totals
    const { subtotal, deliveryFee, total } = calculateOrderTotals(items);

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        subtotal,
        deliveryFee,
        totalAmount: total,
        paymentMethod,
        shippingName,
        shippingPhone,
        shippingCounty,
        shippingTown,
        shippingAddress,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    // Send order confirmation email (non-blocking)
    emailService.sendOrderConfirmation(order.user.email, order).catch(err =>
      console.error('Order confirmation email failed:', err)
    );

    return NextResponse.json({
      message: 'Order placed successfully',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
