import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProjectBySlug } from '@/lib/queries';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const project = await getProjectBySlug(params.slug, params.locale);
  if (!project) return {};
  return {
    title: project.title,
    description: project.excerpt,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'Portfolio' });
  const project = await getProjectBySlug(params.slug, params.locale);

  if (!project) notFound();

  const techStack = project.techStack
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <article className="container-x min-h-screen py-28">
      <Link href={`/${params.locale}#work`} className="text-sm text-white/50 hover:text-accent">
        ← {t('backToWork')}
      </Link>

      <header className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <span className="section-kicker">{project.category}</span>
          <h1 className="mt-3 text-balance text-4xl font-bold leading-tight sm:text-6xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{project.excerpt}</p>
        </div>

        <div className="glass-card grid gap-4 sm:grid-cols-2">
          <Meta label={t('role')} value={project.role || '-'} />
          <Meta label={t('year')} value={project.year || '-'} />
          <Meta label={t('location')} value={project.location || '-'} />
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer" className="btn-primary !py-2 text-center text-xs">
              {t('visitWebsite')}
            </a>
          )}
        </div>
      </header>

      <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="(min-width: 1280px) 1180px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-accent/20 via-violet/20 to-magenta/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="glass-card h-fit">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">{t('techStack')}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {techStack.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
                {tag}
              </span>
            ))}
          </div>
        </aside>

        <section className="prose-course text-white/80" dangerouslySetInnerHTML={{ __html: project.body }} />
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="mt-1 text-sm text-white/80">{value}</p>
    </div>
  );
}
