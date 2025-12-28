import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/middleware';
import { prisma } from '@pausely/db';

export const GET = requireRole(['ADMIN', 'ORG_ADMIN'], async (request: NextRequest) => {
  try {
    const orgId = request.url.split('/').slice(-1)[0];

    const organization = await prisma.organization.findUnique({
      where: { id: orgId, deletedAt: null },
      include: {
        organizationUsers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error('Get organization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

