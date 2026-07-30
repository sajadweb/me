'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from './reveal';

export function Process() {
  const t = useTranslations('Process');

  const steps = [
    { key: 'discover' as const, num: '01' },
    { key: 'design' as const, num: '02' },
    { key: 'build' as const, num: '03' },
    { key: 'scale' as const, num: '04' },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-kicker">{t('kicker')}</span>
          <h2 className="section-title mt-2">{t('title')}</h2>
        </Reveal>

        <div className="relative mt-14 grid gap-5 md:grid-cols-4">
          <div className="absolute left-0 top-12 hidden h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.key} delay={i * 100}>
              <div className="relative">
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-full border border-accent/30 bg-ink-900 font-mono text-sm font-bold text-accent">
                  {s.num}
                </span>
                <h3 className="text-lg font-semibold">{t(`steps.${s.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">
                  {t(`steps.${s.key}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
