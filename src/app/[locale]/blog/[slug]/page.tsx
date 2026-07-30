import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
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
  const locale = await getLocale();
  const t = await getTranslations('Blog');

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
          · {estimateReadTime(tr?.body || '')} min read
        </p>

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={tr?.title}
            className="mt-8 aspect-[16/9] w-full rounded-2xl border border-white/10 object-cover"
          />
        )}

        <div
          className="prose-course mt-10 text-white/80"
          dangerouslySetInnerHTML={{ __html: tr?.body || '' }}
        />
      </div>
    </article>
  );
}
