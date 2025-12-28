import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@pausely/db';

export async function GET(request: NextRequest) {
  try {
    const types = await prisma.impulseType.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(types);
  } catch (error) {
    console.error('Get impulse types error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

