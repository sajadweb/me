import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureAdminFromDb } from '@/lib/auth';
import { slugify } from '@/lib/utils';

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
    const body = (await req.json()) as {
      title?: string;
      slug?: string;
      excerpt?: string;
      body?: string;
      coverImage?: string;
      locale?: string;
      published?: boolean;
    };

    if (!body.title || !body.body) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const locale = body.locale || 'en';
    const slug = body.slug ? slugify(body.slug) : slugify(body.title);

    const exists = await prisma.blogPost.findUnique({ where: { slug } });
    const finalSlug = exists ? `${slug}-${Date.now().toString(36)}` : slug;

    const post = await prisma.blogPost.create({
      data: {
        slug: finalSlug,
        coverImage: body.coverImage || null,
        published: body.published ?? true,
        translations: {
          create: {
            locale,
            title: body.title,
            excerpt: body.excerpt || '',
            body: body.body,
          },
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
