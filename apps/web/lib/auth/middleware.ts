import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, type JWTPayload } from '@pausely/auth';
import { prisma } from '@pausely/db';

export interface AuthContext {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: AuthContext['user'] | null; error: string | null }> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'No authorization token provided' };
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId, deletedAt: null },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: 'Invalid or expired token' };
  }
}

export function requireAuth(handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const { user, error } = await authenticateRequest(req);

    if (!user || error) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    return handler(req, { user });
  };
}

export function requireRole(
  roles: string[],
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const { user, error } = await authenticateRequest(req);

    if (!user || error) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    if (!roles.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return handler(req, { user });
  };
}

