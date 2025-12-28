import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken, generateRefreshToken } from '@pausely/auth';
import { prisma } from '@pausely/db';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        profile: {
          create: {
            firstName: validated.firstName,
            lastName: validated.lastName,
          },
        },
        streaks: {
          create: {},
        },
        subscription: {
          create: {
            stripeCustomerId: `temp_${Date.now()}`,
            plan: 'FREE',
            status: 'ACTIVE',
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      user,
      token,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

