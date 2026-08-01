import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureAdminFromDb } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const locales = ['en', 'fa'] as const;

type LocalizedText = {
  title?: string;
  excerpt?: string;
  body?: string;
};

type BlogPayload = {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  coverImage?: string;
  coverUrl?: string;
  locale?: string;
  published?: boolean;
  translations?: Partial<Record<(typeof locales)[number], LocalizedText>>;
};

function normalizeTranslations(body: BlogPayload) {
  const sourceLocale = body.locale === 'fa' ? 'fa' : 'en';
  const source = body.translations?.[sourceLocale] ?? {};
  const fallbackTitle = source.title || body.title || body.translations?.en?.title || body.translations?.fa?.title;
  const fallbackBody = source.body || body.body || body.translations?.en?.body || body.translations?.fa?.body;
  const fallbackExcerpt = source.excerpt || body.excerpt || body.translations?.en?.excerpt || body.translations?.fa?.excerpt || '';

  if (!fallbackTitle || !fallbackBody) return null;

  return locales.map((locale) => ({
    locale,
    title: body.translations?.[locale]?.title || fallbackTitle,
    excerpt: body.translations?.[locale]?.excerpt || fallbackExcerpt,
    body: body.translations?.[locale]?.body || fallbackBody,
  }));
}

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { translations: true },
  });
  return NextResponse.json({ items: posts });
}

export async function POST(req: NextRequest) {
  try {
    await ensureAdminFromDb(req);
    const body = (await req.json()) as BlogPayload;
    const translations = normalizeTranslations(body);

    if (!translations) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const slug = body.slug ? slugify(body.slug) : slugify(translations[0].title);

    const exists = await prisma.blogPost.findUnique({ where: { slug } });
    const finalSlug = exists ? `${slug}-${Date.now().toString(36)}` : slug;

    const post = await prisma.blogPost.create({
      data: {
        slug: finalSlug,
        coverImage: body.coverImage || body.coverUrl || null,
        published: body.published ?? true,
        translations: {
          create: translations,
        },
      },
      include: { translations: true },
    });

    return NextResponse.json({ ok: true, post });
  } catch (e) {
    if ((e as Error).message === 'FORBIDDEN' || (e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: e }, { status: 403 });
    }
    console.error('[blog/create]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
