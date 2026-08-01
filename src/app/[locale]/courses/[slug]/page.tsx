import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const course = await prisma.course.findUnique({ where: { slug: params.slug } });
  if (!course) return {};
  const t = await getTranslations({ locale: params.locale, namespace: 'Courses' });
  return { title: course.slug === 'golang' ? t('golangTitle') : t('nestjsTitle') };
}

export default async function CourseDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'Courses' });
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: { translations: true, modules: { orderBy: { order: 'asc' } } },
  });

  if (!course || !course.published) notFound();

  const tr = course.translations.find((t) => t.locale === locale) ?? course.translations[0];

  return (
    <article className="container-x min-h-screen py-28">
      <header className="mx-auto max-w-3xl">
        <span className="section-kicker">
          {course.category} · {course.level}
        </span>
        <h1 className="section-title mt-2">{tr?.title}</h1>
        <p className="mt-4 text-lg text-white/70">{tr?.excerpt}</p>
        {tr?.body && (
          <div
            className="prose-course mt-10 text-white/80"
            dangerouslySetInnerHTML={{ __html: tr.body }}
          />
        )}
      </header>

      {course.modules.length > 0 && (
        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-6 text-xl font-bold">{t('modules')}</h2>
          <ol className="space-y-3">
            {course.modules.map((m, i) => {
              const data =
                (JSON.parse(m.payload) as {
                  title?: Record<string, string>;
                  body?: Record<string, string>;
                }) || {};
              return (
                <li key={m.id} className="glass-card">
                  <span className="font-mono text-xs text-accent">M{i + 1}</span>
                  <h3 className="mt-1 font-semibold">
                    {data.title?.[locale] ?? data.title?.en ?? 'Module'}
                  </h3>
                  {data.body?.[locale] && (
                    <p className="mt-2 text-sm text-white/60">{data.body[locale]}</p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </article>
  );
}
