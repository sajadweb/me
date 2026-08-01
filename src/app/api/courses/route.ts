import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureAdminFromDb } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const locales = ['en', 'fa'] as const;

type CoursePayload = {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  category?: string;
  level?: string;
  duration?: string;
  locale?: string;
  published?: boolean;
  sortOrder?: number;
  translations?: Partial<Record<(typeof locales)[number], { title?: string; excerpt?: string; body?: string; duration?: string }>>;
};

function normalizeTranslations(body: CoursePayload) {
  const sourceLocale = body.locale === 'fa' ? 'fa' : 'en';
  const source = body.translations?.[sourceLocale] ?? {};
  const fallbackTitle = source.title || body.title || body.translations?.en?.title || body.translations?.fa?.title;
  const fallbackExcerpt = source.excerpt || body.excerpt || body.translations?.en?.excerpt || body.translations?.fa?.excerpt || '';
  const fallbackBody = source.body || body.body || body.translations?.en?.body || body.translations?.fa?.body || '';
  const fallbackDuration = source.duration || body.duration || body.translations?.en?.duration || body.translations?.fa?.duration || null;

  if (!fallbackTitle) return null;

  return locales.map((locale) => ({
    locale,
    title: body.translations?.[locale]?.title || fallbackTitle,
    excerpt: body.translations?.[locale]?.excerpt || fallbackExcerpt,
    body: body.translations?.[locale]?.body || fallbackBody,
    duration: body.translations?.[locale]?.duration || fallbackDuration,
  }));
}

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
    const body = (await req.json()) as CoursePayload;
    const translations = normalizeTranslations(body);

    if (!translations) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

    const slug = body.slug ? slugify(body.slug) : slugify(translations[0].title);
    const exists = await prisma.course.findUnique({ where: { slug } });
    const finalSlug = exists ? `${slug}-${Date.now().toString(36)}` : slug;

    const course = await prisma.course.create({
      data: {
        slug: finalSlug,
        category: body.category || 'backend',
        level: body.level || 'intermediate',
        sortOrder: Number(body.sortOrder ?? 0),
        published: body.published ?? true,
        translations: {
          create: translations,
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
