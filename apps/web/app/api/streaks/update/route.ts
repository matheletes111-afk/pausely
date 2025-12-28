import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { updateStreak } from '@/lib/streaks/calculator';
import { z } from 'zod';

const updateSchema = z.object({
  outcome: z.enum(['SUCCESS', 'RELAPSE', 'ABANDONED']),
});

export const POST = requireAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json();
    const validated = updateSchema.parse(body);

    if (validated.outcome === 'ABANDONED') {
      // Don't update streak for abandoned sessions
      return NextResponse.json({ message: 'Streak not updated for abandoned session' });
    }

    const result = await updateStreak(user.id, validated.outcome);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Update streak error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

