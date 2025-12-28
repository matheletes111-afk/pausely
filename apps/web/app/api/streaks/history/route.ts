import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';

export const GET = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || user.id;
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');

    // If requesting another user's data, require admin role
    if (userId !== user.id) {
      const adminCheck = await requireRole(['ADMIN', 'ORG_ADMIN'], async () => {
        // This will be called if user has admin role
        return NextResponse.json({});
      })(request);

      if (adminCheck.status !== 200) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const sessions = await prisma.urgeSession.findMany({
      where: {
        userId,
        deletedAt: null,
        outcome: { in: ['SUCCESS', 'RELAPSE'] },
      },
      orderBy: { startedAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        impulseType: true,
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Get streak history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

