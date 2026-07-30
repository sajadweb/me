import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureAdminFromDb } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
    include: { translations: true, modules: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json({ items: courses });
}

export async function POST(req: NextRequest) {
  try {
    await ensureAdminFromDb(req);
    const body = (await req.json()) as {
      title?: string;
      slug?: string;
      excerpt?: string;
      category?: string;
      level?: string;
      duration?: string;
      locale?: string;
    };

    if (!body.title) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

    const slug = body.slug ? slugify(body.slug) : slugify(body.title);
    const exists = await prisma.course.findUnique({ where: { slug } });
    const finalSlug = exists ? `${slug}-${Date.now().toString(36)}` : slug;

    const course = await prisma.course.create({
      data: {
        slug: finalSlug,
        category: body.category || 'backend',
        level: body.level || 'intermediate',
        translations: {
          create: {
            locale: body.locale || 'en',
            title: body.title,
            excerpt: body.excerpt || '',
            body: '',
            duration: body.duration || null,
          },
        },
      },
      include: { translations: true },
    });

    return NextResponse.json({ ok: true, course });
  } catch (e) {
    console.error('[course/create]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
