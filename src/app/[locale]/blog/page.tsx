import { getLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { BlogListClient } from './blog-list-client';

export async function generateMetadata() {
  const t = await getTranslations('Blog');
  return { title: t('title') };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getTranslations('Blog');

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { translations: true },
  });

  const mapped = posts.map((p) => {
    const tr = p.translations.find((x) => x.locale === locale) ?? p.translations[0];
    return {
      slug: p.slug,
      coverImage: p.coverImage,
      createdAt: p.createdAt.toISOString(),
      title: tr?.title ?? p.slug,
      excerpt: tr?.excerpt ?? '',
    };
  });

  return (
    <div className="container-x min-h-screen py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">{t('kicker')}</span>
        <h1 className="section-title mt-2">{t('title')}</h1>
        <p className="mt-4 text-white/60">{t('subtitle')}</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <BlogListClient posts={mapped} />
      </div>
    </div>
  );
}
