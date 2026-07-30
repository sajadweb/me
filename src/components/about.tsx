'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from './reveal';

const stack = [
  'Node.js',
  'NestJS',
  'Go',
  'TypeScript',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'RabbitMQ',
  'gRPC',
  'GraphQL',
  'Docker',
  'Kubernetes',
  'GitHub Actions',
  'Web3',
  'OpenAI',
  'Ollama',
];

export function About() {
  const t = useTranslations('About');

  const values = [
    { key: 'architecture' as const, icon: '◆' },
    { key: 'ai' as const, icon: '✦' },
    { key: 'teaching' as const, icon: '▲' },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <span className="section-kicker">{t('kicker')}</span>
            <h2 className="section-title mt-2">{t('title')}</h2>
            <p className="mt-6 text-pretty text-white/70 leading-8">{t('lead')}</p>

            <a
              href="/SajjadCv.docx-2026-06.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-8 inline-flex"
            >
              ↓ {t('downloadCv')}
            </a>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-4">
              {values.map((v) => (
                <div key={v.key} className="glass-card flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent/30 to-violet/30 text-accent">
                    {v.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold">{t(`values.${v.key}.title`)}</h3>
                    <p className="mt-1 text-sm text-white/60">{t(`values.${v.key}.body`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="mt-16">
            <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              {t('stackTitle')}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-white/75 transition-all hover:border-accent/40 hover:text-accent"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
