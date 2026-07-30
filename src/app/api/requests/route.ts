import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      type?: string;
      budget?: string;
      message?: string;
    };

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await getSession(req);

    const record = await prisma.serviceRequest.create({
      data: {
        userId: user?.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        type: body.type || 'consulting',
        budget: body.budget,
        message: body.message,
      },
    });

    return NextResponse.json({ ok: true, id: record.id });
  } catch (e) {
    console.error('[request]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = await getSession(req);
  if (!user) return NextResponse.json({ items: [] });

  const items = await prisma.serviceRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ items });
}
