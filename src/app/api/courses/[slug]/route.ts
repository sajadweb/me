import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureAdminFromDb } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const locales = ['en', 'fa'] as const;

type CoursePayload = {
  slug?: string;
  category?: string;
  level?: string;
  sortOrder?: number;
  published?: boolean;
  translations?: Partial<Record<(typeof locales)[number], { title?: string; excerpt?: string; body?: string; duration?: string }>>;
};

export async function GET(_req: NextRequest, ctx: { params: { slug: string } }) {
  const course = await prisma.course.findUnique({
    where: { slug: ctx.params.slug },
    include: { translations: true, modules: { orderBy: { order: 'asc' } } },
  });
  if (!course || !course.published) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ course });
}

export async function PATCH(req: NextRequest, ctx: { params: { slug: string } }) {
  try {
    await ensureAdminFromDb(req);
    const body = (await req.json()) as CoursePayload;
    const nextSlug = body.slug ? slugify(body.slug) : ctx.params.slug;

    if (nextSlug !== ctx.params.slug) {
      const exists = await prisma.course.findUnique({ where: { slug: nextSlug } });
      if (exists) return NextResponse.json({ error: 'Slug exists' }, { status: 409 });
    }

    const course = await prisma.course.update({
      where: { slug: ctx.params.slug },
      data: {
        slug: nextSlug,
        category: body.category || 'backend',
        level: body.level || 'intermediate',
        sortOrder: Number(body.sortOrder ?? 0),
        published: body.published ?? true,
      },
      include: { translations: true },
    });

    for (const locale of locales) {
      const input = body.translations?.[locale];
      if (!input?.title && !input?.body && !input?.excerpt && !input?.duration) continue;
      await prisma.courseTranslation.upsert({
        where: { courseId_locale: { courseId: course.id, locale } },
        update: {
          title: input.title || '',
          excerpt: input.excerpt || '',
          body: input.body || '',
          duration: input.duration || null,
        },
        create: {
          courseId: course.id,
          locale,
          title: input.title || '',
          excerpt: input.excerpt || '',
          body: input.body || '',
          duration: input.duration || null,
        },
      });
    }

    const updated = await prisma.course.findUnique({
      where: { slug: nextSlug },
      include: { translations: true, modules: { orderBy: { order: 'asc' } } },
    });
    return NextResponse.json({ ok: true, course: updated });
  } catch (e) {
    console.error('[course/update]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: { slug: string } }) {
  try {
    await ensureAdminFromDb(req);
    await prisma.course.delete({ where: { slug: ctx.params.slug } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[course/delete]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
