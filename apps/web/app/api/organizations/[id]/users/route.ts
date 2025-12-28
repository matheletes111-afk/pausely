import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';
import { z } from 'zod';

const assignUserSchema = z.object({
  userId: z.string(),
  role: z.enum(['USER', 'ADMIN', 'ORG_ADMIN']).optional().default('USER'),
});

export const POST = requireRole(['ADMIN', 'ORG_ADMIN'], async (request: NextRequest) => {
  try {
    const orgId = request.url.split('/').slice(-2, -1)[0];
    const body = await request.json();
    const validated = assignUserSchema.parse(body);

    const organization = await prisma.organization.findUnique({
      where: { id: orgId, deletedAt: null },
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const organizationUser = await prisma.organizationUser.upsert({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: validated.userId,
        },
      },
      create: {
        organizationId: orgId,
        userId: validated.userId,
        role: validated.role,
      },
      update: {
        role: validated.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Update seat count
    const seatCount = await prisma.organizationUser.count({
      where: { organizationId: orgId },
    });

    await prisma.organization.update({
      where: { id: orgId },
      data: { seatCount },
    });

    return NextResponse.json(organizationUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Assign user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

