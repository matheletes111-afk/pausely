import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';
import { z } from 'zod';

const createOrgSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
});

export const GET = requireRole(['ADMIN', 'ORG_ADMIN'], async (request: NextRequest) => {
  try {
    const organizations = await prisma.organization.findMany({
      where: { deletedAt: null },
      include: {
        organizationUsers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Get organizations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = requireRole(['ADMIN'], async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validated = createOrgSchema.parse(body);

    const organization = await prisma.organization.create({
      data: {
        name: validated.name,
        slug: validated.slug,
      },
      include: {
        organizationUsers: true,
      },
    });

    return NextResponse.json(organization);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Create organization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

