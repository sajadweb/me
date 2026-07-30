'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from './reveal';

export function CtaBand() {
  const tS = useTranslations('Services');
  const tNav = useTranslations('Nav');

  return (
    <section className="relative py-16">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/10 via-violet/10 to-magenta/10 p-10 sm:p-14">
            <div className="grid-overlay opacity-50" />
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">{tS('ctaTitle')}</h2>
              <p className="mt-4 text-white/70">{tS('ctaBody')}</p>
              <a href="#contact" className="btn-primary mt-8">
                {tNav('contact')}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
