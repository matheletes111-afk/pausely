import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';
import { generateSessionSummary } from '@/lib/ai/openai';
import { z } from 'zod';

const summarizeSchema = z.object({
  sessionId: z.string(),
});

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validated = summarizeSchema.parse(body);

    const session = await prisma.urgeSession.findUnique({
      where: { id: validated.sessionId, deletedAt: null },
      include: {
        aiMessages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const conversationHistory = session.aiMessages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const summary = await generateSessionSummary(conversationHistory);

    const updatedSession = await prisma.urgeSession.update({
      where: { id: validated.sessionId },
      data: { summary },
      include: {
        impulseType: true,
        aiMessages: true,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Summarize error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

