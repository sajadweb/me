'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { NeuralBackground } from './neural-background';

export function Hero() {
  const t = useTranslations('Hero');
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      <NeuralBackground className="opacity-70" />
      <div className="aurora" />
      <div className="grid-overlay" />
      <div className="scanline" />

      <div className="container-x relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 font-mono text-xs text-accent-300 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t('badge')}
          </div>

          <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
            {t('titlePrefix')}{' '}
            <span className="gradient-text animate-gradient-pan bg-[length:200%_auto]">
              {t('titleHighlight')}
            </span>{' '}
            {t('titleSuffix')}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
            {t('subtitle')}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={`/${locale}/request`} className="btn-primary group">
              {t('ctaPrimary')}
              <span className="transition-transform group-hover:translate-x-1 rtl:rotate-180">→</span>
            </Link>
            <Link href={`/${locale}/courses`} className="btn-ghost">
              {t('ctaSecondary')}
            </Link>
          </div>

          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6">
            {[
              { value: '15+', key: 'experience' as const },
              { value: '50+', key: 'projects' as const },
              { value: '200+', key: 'students' as const },
            ].map((s) => (
              <div key={s.key} className="text-center">
                <dt className="gradient-text text-3xl font-bold sm:text-4xl">{s.value}</dt>
                <dd className="mt-1 text-xs text-white/50 sm:text-sm">{t(`stats.${s.key}`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
