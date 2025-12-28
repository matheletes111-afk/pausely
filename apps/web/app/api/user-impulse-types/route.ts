import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';
import { z } from 'zod';

const createUserImpulseTypeSchema = z.object({
  impulseTypeId: z.string(),
  isActive: z.boolean().optional().default(true),
  customTimerMinutes: z.number().min(1).max(60).optional(),
});

export const POST = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json();
    const validated = createUserImpulseTypeSchema.parse(body);

    const userImpulseType = await prisma.userImpulseType.upsert({
      where: {
        userId_impulseTypeId: {
          userId: user.id,
          impulseTypeId: validated.impulseTypeId,
        },
      },
      create: {
        userId: user.id,
        impulseTypeId: validated.impulseTypeId,
        isActive: validated.isActive,
        customTimerMinutes: validated.customTimerMinutes,
      },
      update: {
        isActive: validated.isActive,
        customTimerMinutes: validated.customTimerMinutes,
      },
      include: {
        impulseType: true,
      },
    });

    return NextResponse.json(userImpulseType);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Create user impulse type error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const GET = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const userImpulseTypes = await prisma.userImpulseType.findMany({
      where: { userId: user.id },
      include: {
        impulseType: true,
      },
    });

    return NextResponse.json(userImpulseTypes);
  } catch (error) {
    console.error('Get user impulse types error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

