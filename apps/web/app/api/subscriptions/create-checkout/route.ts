import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { stripe } from '@/lib/stripe/client';
import { prisma } from '@pausely/db';

export const POST = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId || customerId.startsWith('temp_')) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });

      customerId = customer.id;

      // Update or create subscription record
      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeCustomerId: customerId,
          plan: 'FREE',
          status: 'ACTIVE',
        },
        update: {
          stripeCustomerId: customerId,
        },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_test',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/subscription?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

