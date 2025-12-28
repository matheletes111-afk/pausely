import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';

export const GET = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const sessionId = request.url.split('/').slice(-1)[0];

    const session = await prisma.urgeSession.findUnique({
      where: { id: sessionId, deletedAt: null },
      include: {
        impulseType: true,
        aiMessages: {
          orderBy: { createdAt: 'asc' },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.userId !== user.id && !['ADMIN', 'ORG_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

