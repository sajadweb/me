import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminFromDb } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const statuses = ['PENDING', 'ACTIVE', 'DONE'] as const;

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    await ensureAdminFromDb(req);
    const body = (await req.json()) as { status?: string };
    const status = statuses.includes(body.status as (typeof statuses)[number]) ? body.status : 'PENDING';
    const item = await prisma.enrollment.update({
      where: { id: Number(ctx.params.id) },
      data: { status },
    });
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    console.error('[admin/enrollment/update]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}