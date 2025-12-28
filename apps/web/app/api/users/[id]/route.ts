import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';

export const GET = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const id = request.url.split('/').slice(-1)[0];

    // Users can view their own profile, admins can view any
    if (id !== user.id && !['ADMIN', 'ORG_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userData = await prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        profile: true,
        streaks: true,
        subscription: true,
        userImpulseTypes: {
          include: {
            impulseType: true,
          },
        },
        urgeSessions: {
          take: 10,
          orderBy: { startedAt: 'desc' },
          include: {
            impulseType: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { passwordHash, ...userWithoutPassword } = userData;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const PUT = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const id = request.url.split('/').slice(-1)[0];

    if (id !== user.id && !['ADMIN', 'ORG_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { profile, ...userData } = body;

    const updateData: any = {};
    if (userData.email) updateData.email = userData.email;
    if (userData.role && ['ADMIN', 'ORG_ADMIN'].includes(user.role)) {
      updateData.role = userData.role;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(profile && {
          profile: {
            upsert: {
              create: profile,
              update: profile,
            },
          },
        }),
      },
      include: {
        profile: true,
      },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

