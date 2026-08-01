import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminFromDb } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    await ensureAdminFromDb(req);
    const body = (await req.json()) as { name?: string; email?: string; phone?: string; role?: string };
    const item = await prisma.user.update({
      where: { id: Number(ctx.params.id) },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        role: body.role === 'ADMIN' ? 'ADMIN' : 'USER',
      },
    });
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    console.error('[admin/user/update]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}