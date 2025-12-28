import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';
import { generateAIResponse } from '@/lib/ai/openai';
import { z } from 'zod';

const messageSchema = z.object({
  content: z.string().min(1),
});

export const POST = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const sessionId = request.url.split('/').slice(-2, -1)[0];
    const body = await request.json();
    const validated = messageSchema.parse(body);

    const session = await prisma.urgeSession.findUnique({
      where: { id: sessionId, deletedAt: null },
      include: {
        impulseType: true,
        aiMessages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Save user message
    const userMessage = await prisma.aIMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: validated.content,
      },
    });

    // Get conversation history
    const conversationHistory = session.aiMessages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Generate AI response
    const aiResponse = await generateAIResponse(
      validated.content,
      conversationHistory,
      session.impulseType.name
    );

    // Save AI message
    const aiMessage = await prisma.aIMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: aiResponse,
      },
    });

    return NextResponse.json({
      id: aiMessage.id,
      sessionId: aiMessage.sessionId,
      role: aiMessage.role,
      content: aiMessage.content,
      createdAt: aiMessage.createdAt,
      session: {
        id: session.id,
        userId: session.userId,
        impulseTypeId: session.impulseTypeId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('AI message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

