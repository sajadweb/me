import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = (await req.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
    };

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'EMAIL_EXISTS' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const adminEmail = process.env.ADMIN_EMAIL;
    const role = adminEmail && email.toLowerCase() === adminEmail.toLowerCase() ? 'ADMIN' : 'USER';

    const user = await prisma.user.create({
      data: { name, email, phone, password: hashed, role },
    });

    const token = await signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    });

    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role } });
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    console.error('[register]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
