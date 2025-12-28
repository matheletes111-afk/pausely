import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';

export const POST = requireAuth(async (request: NextRequest) => {
  // In a production app, you might want to blacklist the token
  // For now, we just return success - the client should discard the token
  return NextResponse.json({ message: 'Logged out successfully' });
});

