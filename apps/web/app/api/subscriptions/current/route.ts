import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';

export const GET = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

