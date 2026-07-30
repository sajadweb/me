'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const tCommon = useTranslations('Common');
  const locale = useLocale();

  const year = new Date().getFullYear();

  const nav = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}#about`, label: tNav('about') },
    { href: `/${locale}#services`, label: tNav('services') },
    { href: `/${locale}#work`, label: tNav('portfolio') },
    { href: `/${locale}/courses`, label: tNav('courses') },
    { href: `/${locale}/blog`, label: tNav('blog') },
    { href: `/${locale}/request`, label: tNav('contact') },
  ];

  const socials = [
    { label: tCommon('github'), href: 'https://github.com/sajadweb', icon: 'github' },
    { label: tCommon('linkedin'), href: 'https://www.linkedin.com/in/sajadweb', icon: 'linkedin' },
    { label: tCommon('twitter'), href: 'https://twitter.com/sajadweb', icon: 'twitter' },
    { label: tCommon('instagram'), href: 'https://instagram.com/sajadweb', icon: 'instagram' },
  ];

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-ink-900/60">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent to-violet font-mono text-sm font-bold text-ink-900">
                SM
              </span>
              <span className="text-sm font-semibold">
                sajadweb<span className="text-accent">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">{t('tagline')}</p>
            <div className="mt-5 flex flex-col gap-1 text-sm text-white/70">
              <a href={`mailto:${tCommon('email')}`} className="hover:text-accent">
                {tCommon('email')}
              </a>
              <a href={`tel:${tCommon('phone').replace(/\s/g, '')}`} className="hover:text-accent">
                {tCommon('phone')}
              </a>
              <span className="text-white/40">{tCommon('location')}</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-white/70 transition-colors hover:text-accent">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              {t('social')}
            </h4>
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition-all hover:-translate-y-1 hover:border-accent/40 hover:text-accent"
                  aria-label={s.label}
                >
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
            <a
              href={`/${locale}/request`}
              className="btn-primary mt-6 inline-flex !py-2.5 text-xs"
            >
              {tNav('getStarted')}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {year} Sajjad Mohammadi Nejad. {t('rights')}</p>
          <p>{t('madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const common = 'h-5 w-5';
  switch (name) {
    case 'github':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.3a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM19 19h-3v-4.7c0-1.1-.4-1.8-1.4-1.8-1.1 0-1.7.7-2 1.4-.1.2-.1.6-.1.9V19h-3v-9h3v1.3c.4-.6 1.2-1.5 2.9-1.5 2.1 0 3.6 1.4 3.6 4.2V19z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.7L7.4 3.8H5.6L17.7 20z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.3a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 10.7a4.2 4.2 0 110-8.4 4.2 4.2 0 010 8.4zm6.7-11a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      );
    default:
      return null;
  }
}
