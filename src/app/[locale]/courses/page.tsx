import { getLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { CoursesClient } from './courses-client';
import { Reveal } from '@/components/reveal';

export async function generateMetadata() {
  const t = await getTranslations('Courses');
  return { title: t('title') };
}

export default async function CoursesPage() {
  const locale = await getLocale();
  const t = await getTranslations('Courses');
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
    include: { translations: true },
  });

  const mapped = courses.map((c) => {
    const tr = c.translations.find((x) => x.locale === locale) ?? c.translations[0];
    return {
      id: c.id,
      slug: c.slug,
      level: c.level,
      duration: tr?.duration ?? '',
      title: tr?.title ?? c.slug,
      excerpt: tr?.excerpt ?? '',
    };
  });

  return (
    <div className="container-x min-h-screen py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">{t('kicker')}</span>
        <h1 className="section-title mt-2">{t('title')}</h1>
        <p className="mt-4 text-white/60">{t('subtitle')}</p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <CoursesClient courses={mapped} />
      </div>
    </div>
  );
}
