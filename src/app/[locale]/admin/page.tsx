import { redirect } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { requireAdmin } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { AdminClient } from './admin-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const t = await getTranslations('Admin');
  return { title: t('title') };
}

export default async function AdminPage() {
  const locale = await getLocale();
  try {
    await requireAdmin();
  } catch {
    redirect(`/${locale}/login`);
  }

  const [requests, enrollments, users, posts, courses] = await Promise.all([
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
  ]);

  return (
    <AdminClient
      requests={requests.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        type: r.type,
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
        role: u.role,
      }))}
      posts={posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.translations[0]?.title ?? p.slug,
        published: p.published,
      }))}
      courses={courses.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.translations.find((t) => t.locale === locale)?.title ?? c.slug,
        level: c.level,
      }))}
    />
  );
}
