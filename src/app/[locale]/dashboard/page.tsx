import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { DashboardClient } from './dashboard-client';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Dashboard' });
  return { title: t('title') };
}

export default async function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const user = await getSession();

  if (!user) redirect(`/${locale}/login`);

  const [enrollments, requests] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
      include: { course: { include: { translations: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.serviceRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <DashboardClient
      user={user}
      enrollments={enrollments.map((e) => ({
        id: e.id,
        status: e.status,
        course: {
          slug: e.course.slug,
          title:
            e.course.translations.find((t) => t.locale === locale)?.title ?? e.course.slug,
        },
      }))}
      requests={requests.map((r) => ({
        id: r.id,
        type: r.type,
        status: r.status,
        message: r.message,
        createdAt: r.createdAt.toISOString(),
      }))}
    />
  );
}
