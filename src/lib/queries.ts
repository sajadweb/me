import { prisma } from '@/lib/prisma';

export type LocalizedProject = {
  id: number;
  slug: string;
  coverImage: string | null;
  url: string | null;
  role: string | null;
  year: string | null;
  title: string;
  category: string;
  location: string;
  excerpt: string;
  body: string;
  techStack: string;
};

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
      body: tr?.body ?? '',
      techStack: tr?.techStack ?? '',
    };
  });
}

export async function getProjectBySlug(slug: string, locale: string): Promise<LocalizedProject | null> {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { translations: true },
  });

  if (!project || !project.published) return null;

  const tr = project.translations.find((t) => t.locale === locale) ?? project.translations[0];

  return {
    id: project.id,
    slug: project.slug,
    coverImage: project.coverImage,
    url: project.url,
    role: project.role,
    year: project.year,
    title: tr?.title ?? project.slug,
    category: tr?.category ?? '',
    location: tr?.location ?? '',
    excerpt: tr?.excerpt ?? '',
    body: tr?.body ?? '',
    techStack: tr?.techStack ?? '',
  };
}
