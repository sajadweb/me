import { getLocale, getTranslations } from 'next-intl/server';
import { Reveal } from './reveal';
import { getFeaturedProjects } from '@/lib/queries';

export async function PortfolioPreview() {
  const t = await getTranslations('Portfolio');
  const locale = await getLocale();
  const projects = await getFeaturedProjects(locale);

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="section-kicker">{t('kicker')}</span>
            <h2 className="section-title mt-2">{t('title')}</h2>
            <p className="mt-4 text-white/60">{t('subtitle')}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <article className="glass-card group h-full p-0 overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-accent/20 to-violet/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-ink-900/60 px-3 py-1 text-xs backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>{p.location || '—'}</span>
                    <span>{p.year}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold group-hover:text-accent">{p.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{p.excerpt}</p>
                  {p.techStack && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.techStack.split(',').map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/50"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
