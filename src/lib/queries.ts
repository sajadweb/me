import { prisma } from '@/lib/prisma';

export async function getFeaturedProjects(locale: string) {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: { translations: true },
  });

  return projects.map((p) => {
    const tr = p.translations.find((t) => t.locale === locale) ?? p.translations[0];
    return {
      id: p.id,
      slug: p.slug,
      coverImage: p.coverImage,
      url: p.url,
      role: p.role,
      year: p.year,
      title: tr?.title ?? p.slug,
      category: tr?.category ?? '',
      location: tr?.location ?? '',
      excerpt: tr?.excerpt ?? '',
      techStack: tr?.techStack ?? '',
    };
  });
}
