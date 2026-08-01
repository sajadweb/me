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
  translations?: Partial<
    Record<
      (typeof locales)[number],
      { title?: string; category?: string; location?: string; excerpt?: string; body?: string; techStack?: string }
    >
  >;
};

export async function GET(_req: NextRequest, ctx: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: ctx.params.slug },
    include: { translations: true },
  });
  if (!project || !project.published) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PATCH(req: NextRequest, ctx: { params: { slug: string } }) {
  try {
    await ensureAdminFromDb(req);
    const body = (await req.json()) as ProjectPayload;
    const nextSlug = body.slug ? slugify(body.slug) : ctx.params.slug;

    if (nextSlug !== ctx.params.slug) {
      const exists = await prisma.project.findUnique({ where: { slug: nextSlug } });
      if (exists) return NextResponse.json({ error: 'Slug exists' }, { status: 409 });
    }

    const project = await prisma.project.update({
      where: { slug: ctx.params.slug },
      data: {
        slug: nextSlug,
        coverImage: body.coverImage ?? body.coverUrl ?? null,
        url: body.url || null,
        role: body.role || null,
        year: body.year || null,
        published: body.published ?? true,
      },
      include: { translations: true },
    });

    for (const locale of locales) {
      const input = body.translations?.[locale];
      if (!input?.title && !input?.excerpt && !input?.body && !input?.category && !input?.techStack) continue;
      await prisma.projectTranslation.upsert({
        where: { projectId_locale: { projectId: project.id, locale } },
        update: {
          title: input.title || '',
          category: input.category || '',
          location: input.location || null,
          excerpt: input.excerpt || '',
          body: input.body || '',
          techStack: input.techStack || '',
        },
        create: {
          projectId: project.id,
          locale,
          title: input.title || '',
          category: input.category || '',
          location: input.location || null,
          excerpt: input.excerpt || '',
          body: input.body || '',
          techStack: input.techStack || '',
        },
      });
    }

    const updated = await prisma.project.findUnique({
      where: { slug: nextSlug },
      include: { translations: true },
    });
    return NextResponse.json({ ok: true, project: updated });
  } catch (e) {
    console.error('[project/update]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: { slug: string } }) {
  try {
    await ensureAdminFromDb(req);
    await prisma.project.delete({ where: { slug: ctx.params.slug } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[project/delete]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}