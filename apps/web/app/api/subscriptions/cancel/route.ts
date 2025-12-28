import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { stripe } from '@/lib/stripe/client';
import { prisma } from '@pausely/db';

export const POST = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    return NextResponse.json({ message: 'Subscription will be canceled at period end' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

