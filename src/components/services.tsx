'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Reveal } from './reveal';

export function Services() {
  const t = useTranslations('Services');
  const locale = useLocale();

  const items = [
    { key: 'consulting' as const, icon: IconConsulting },
    { key: 'web' as const, icon: IconWeb },
    { key: 'training' as const, icon: IconTraining },
    { key: 'ai' as const, icon: IconAi },
    { key: 'devops' as const, icon: IconDevops },
    { key: 'review' as const, icon: IconReview },
  ];

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-kicker">{t('kicker')}</span>
          <h2 className="section-title mt-2">{t('title')}</h2>
          <p className="mt-4 text-white/60">{t('subtitle')}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.key} delay={i * 80}>
              <article className="glass-card group h-full">
                <span className="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-violet/20 text-accent transition-transform group-hover:scale-110">
                  <item.icon />
                </span>
                <h3 className="text-lg font-semibold">{t(`items.${item.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">
                  {t(`items.${item.key}.body`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="glass-card mt-14 flex flex-col items-start justify-between gap-6 bg-gradient-to-r from-accent/10 via-transparent to-violet/10 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-bold">{t('ctaTitle')}</h3>
              <p className="mt-2 max-w-xl text-sm text-white/60">{t('ctaBody')}</p>
            </div>
            <Link href={`/${locale}/request`} className="btn-primary shrink-0">
              {t('ctaButton')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type IconProps = { className?: string };

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function IconConsulting({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...stroke}>
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M7 9v5c0 1 2 2 5 2s5-1 5-2V9" />
      <path d="M21 7v6" />
    </svg>
  );
}
function IconWeb({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 8h18" />
      <path d="M8 21h8" />
      <path d="M12 18v3" />
    </svg>
  );
}
function IconTraining({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...stroke}>
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
    </svg>
  );
}
function IconAi({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </svg>
  );
}
function IconDevops({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...stroke}>
      <path d="M6 12a6 6 0 0110-4l2 2" />
      <path d="M18 12a6 6 0 01-10 4l-2-2" />
      <path d="M16 6v4h4M8 18v-4H4" />
    </svg>
  );
}
function IconReview({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...stroke}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
