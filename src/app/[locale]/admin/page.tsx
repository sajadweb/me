import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { requireAdmin } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { AdminClient } from './admin-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Admin' });
  return { title: t('title') };
}

export default async function AdminPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  try {
    await requireAdmin();
  } catch {
    redirect(`/${locale}/login`);
  }

  const [requests, enrollments, users, posts, courses, projects] = await Promise.all([
    prisma.serviceRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.enrollment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: true, course: { include: { translations: true } } },
    }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { translations: true },
    }),
    prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { translations: true },
    }),
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: { translations: true },
    }),
  ]);

  return (
    <AdminClient
      requests={requests.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        type: r.type,
        budget: r.budget,
        message: r.message,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      }))}
      enrollments={enrollments.map((e) => ({
        id: e.id,
        userName: e.user.name,
        courseTitle:
          e.course.translations.find((t) => t.locale === locale)?.title ?? e.course.slug,
        status: e.status,
        createdAt: e.createdAt.toISOString(),
      }))}
      users={users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
      }))}
      posts={posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        coverImage: p.coverImage,
        title: p.translations.find((t) => t.locale === locale)?.title ?? p.translations[0]?.title ?? p.slug,
        published: p.published,
        translations: p.translations.map((t) => ({
          locale: t.locale,
          title: t.title,
          excerpt: t.excerpt,
          body: t.body,
        })),
      }))}
      courses={courses.map((c) => ({
        id: c.id,
        slug: c.slug,
        category: c.category,
        title: c.translations.find((t) => t.locale === locale)?.title ?? c.slug,
        level: c.level,
        sortOrder: c.sortOrder,
        published: c.published,
        translations: c.translations.map((t) => ({
          locale: t.locale,
          title: t.title,
          excerpt: t.excerpt,
          body: t.body,
          duration: t.duration,
        })),
      }))}
      projects={projects.map((p) => ({
        id: p.id,
        slug: p.slug,
        coverImage: p.coverImage,
        url: p.url,
        role: p.role,
        year: p.year,
        title: p.translations.find((t) => t.locale === locale)?.title ?? p.slug,
        published: p.published,
        translations: p.translations.map((t) => ({
          locale: t.locale,
          title: t.title,
          category: t.category,
          location: t.location,
          excerpt: t.excerpt,
          body: t.body,
          techStack: t.techStack,
        })),
      }))}
    />
  );
}
