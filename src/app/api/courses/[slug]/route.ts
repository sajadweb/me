import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, ctx: { params: { slug: string } }) {
  const course = await prisma.course.findUnique({
    where: { slug: ctx.params.slug },
    include: { translations: true, modules: { orderBy: { order: 'asc' } } },
  });
  if (!course || !course.published) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ course });
}
