import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';
import { updateStreak } from '@/lib/streaks/calculator';
import { generateSessionSummary } from '@/lib/ai/openai';
import { z } from 'zod';

const completeSchema = z.object({
  outcome: z.enum(['SUCCESS', 'RELAPSE', 'ABANDONED']),
});

export const POST = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const sessionId = request.url.split('/').slice(-2, -1)[0];
    const body = await request.json();
    const validated = completeSchema.parse(body);

    const session = await prisma.urgeSession.findUnique({
      where: { id: sessionId, deletedAt: null },
      include: {
        aiMessages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate summary if there are messages
    let summary = session.summary;
    if (session.aiMessages.length > 0 && !summary) {
      const conversationHistory = session.aiMessages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));
      summary = await generateSessionSummary(conversationHistory);
    }

    // Update session
    const updatedSession = await prisma.urgeSession.update({
      where: { id: sessionId },
      data: {
        outcome: validated.outcome,
        completedAt: new Date(),
        summary,
      },
      include: {
        impulseType: true,
        aiMessages: true,
      },
    });

    // Update streak if not abandoned
    if (validated.outcome !== 'ABANDONED') {
      await updateStreak(user.id, validated.outcome);
    }

    return NextResponse.json(updatedSession);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Complete session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

