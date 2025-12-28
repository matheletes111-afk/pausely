import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';

export const GET = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const streak = await prisma.streak.findUnique({
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

    if (!streak) {
      // Create default streak
      const newStreak = await prisma.streak.create({
        data: {
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      return NextResponse.json(newStreak);
    }

    return NextResponse.json(streak);
  } catch (error) {
    console.error('Get streak error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

