import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminFromDb } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const statuses = ['NEW', 'REVIEW', 'DONE'] as const;

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    await ensureAdminFromDb(req);
    const body = (await req.json()) as { status?: string };
    const status = statuses.includes(body.status as (typeof statuses)[number]) ? body.status : 'NEW';
    const item = await prisma.serviceRequest.update({
      where: { id: Number(ctx.params.id) },
      data: { status },
    });
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    console.error('[admin/request/update]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}