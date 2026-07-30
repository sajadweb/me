import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string };
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'INVALID' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ error: 'INVALID' }, { status: 401 });

    const token = await signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    });

    const res = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    console.error('[login]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
