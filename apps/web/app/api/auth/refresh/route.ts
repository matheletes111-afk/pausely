import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateToken } from '@pausely/auth';
import { prisma } from '@pausely/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId, deletedAt: null },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const newToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      token: newToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
  }
}

