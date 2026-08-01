import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminFromDb } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

const locales = ['en', 'fa'] as const;

type ProjectPayload = {
  slug?: string;
  coverImage?: string;
  coverUrl?: string;
  url?: string;
  role?: string;
  year?: string;
  published?: boolean;
  locale?: string;
  translations?: Partial<
    Record<
      (typeof locales)[number],
      { title?: string; category?: string; location?: string; excerpt?: string; body?: string; techStack?: string }
    >
  >;
};

function normalizeTranslations(body: ProjectPayload) {
  const sourceLocale = body.locale === 'fa' ? 'fa' : 'en';
  const source = body.translations?.[sourceLocale] ?? {};
  const fallbackTitle = source.title || body.translations?.en?.title || body.translations?.fa?.title;
  const fallbackExcerpt = source.excerpt || body.translations?.en?.excerpt || body.translations?.fa?.excerpt || '';

  if (!fallbackTitle) return null;

  return locales.map((locale) => ({
    locale,
    title: body.translations?.[locale]?.title || fallbackTitle,
    category: body.translations?.[locale]?.category || body.translations?.en?.category || body.translations?.fa?.category || '',
    location: body.translations?.[locale]?.location || body.translations?.en?.location || body.translations?.fa?.location || null,
    excerpt: body.translations?.[locale]?.excerpt || fallbackExcerpt,
    body: body.translations?.[locale]?.body || body.translations?.en?.body || body.translations?.fa?.body || '',
    techStack: body.translations?.[locale]?.techStack || body.translations?.en?.techStack || body.translations?.fa?.techStack || '',
  }));
}

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { translations: true },
  });
  return NextResponse.json({ items: projects });
}

export async function POST(req: NextRequest) {
  try {
    await ensureAdminFromDb(req);
    const body = (await req.json()) as ProjectPayload;
    const translations = normalizeTranslations(body);

    if (!translations) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

    const slug = body.slug ? slugify(body.slug) : slugify(translations[0].title);
    const exists = await prisma.project.findUnique({ where: { slug } });
    const finalSlug = exists ? `${slug}-${Date.now().toString(36)}` : slug;

    const project = await prisma.project.create({
      data: {
        slug: finalSlug,
        coverImage: body.coverImage || body.coverUrl || null,
        url: body.url || null,
        role: body.role || null,
        year: body.year || null,
        published: body.published ?? true,
        translations: { create: translations },
      },
      include: { translations: true },
    });

    return NextResponse.json({ ok: true, project });
  } catch (e) {
    console.error('[project/create]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}