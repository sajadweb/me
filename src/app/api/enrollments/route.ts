import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { courseId } = (await req.json()) as { courseId?: number };
    const user = await getSession(req);
    if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });

    const enr = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId } },
      update: {},
      create: { userId: user.id, courseId, status: 'ACTIVE' },
    });

    return NextResponse.json({ ok: true, enrollment: enr });
  } catch (e) {
    console.error('[enroll]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = await getSession(req);
  if (!user) return NextResponse.json({ items: [] });
  const items = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: { course: { include: { translations: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ items });
}
