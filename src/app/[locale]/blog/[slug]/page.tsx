import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { estimateReadTime } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: { translations: true },
  });
  return { title: post?.translations[0]?.title };
}

export default async function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'Blog' });

  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: { translations: true },
  });
  if (!post || !post.published) notFound();

  const tr = post.translations.find((x) => x.locale === locale) ?? post.translations[0];

  return (
    <article className="container-x min-h-screen py-28">
      <div className="mx-auto max-w-3xl">
        <a
          href={`/${locale}/blog`}
          className="text-sm text-white/50 hover:text-accent"
        >
          ← {t('kicker')}
        </a>
        <h1 className="mt-6 text-4xl font-bold leading-tight">{tr?.title}</h1>
        <p className="mt-3 text-sm text-white/50">
          {new Date(post.createdAt).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          · {t('minRead', { minutes: estimateReadTime(tr?.body || '') })}
        </p>

        {post.coverImage && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={post.coverImage}
              alt={tr?.title ?? post.slug}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose-course mt-10 text-white/80"
          dangerouslySetInnerHTML={{ __html: tr?.body || '' }}
        />
      </div>
    </article>
  );
}
