import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';
import { z } from 'zod';

const createSessionSchema = z.object({
  impulseTypeId: z.string(),
  timerMinutes: z.number().min(1).max(60).optional().default(10),
});

export const POST = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json();
    const validated = createSessionSchema.parse(body);

    const session = await prisma.urgeSession.create({
      data: {
        userId: user.id,
        impulseTypeId: validated.impulseTypeId,
        timerMinutes: validated.timerMinutes,
      },
      include: {
        impulseType: true,
        aiMessages: true,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const GET = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || user.id;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // If requesting another user's data, require admin role
    if (userId !== user.id) {
      const adminCheck = await requireRole(['ADMIN', 'ORG_ADMIN'], async () => {
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
      },
      take: limit,
      skip: offset,
      orderBy: { startedAt: 'desc' },
      include: {
        impulseType: true,
        aiMessages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

