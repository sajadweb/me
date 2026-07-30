'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSession } from './session-provider';
import { LocaleSwitch } from './locale-switch';

export function SiteHeader() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links: { href: string; label: string }[] = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}#about`, label: t('about') },
    { href: `/${locale}#services`, label: t('services') },
    { href: `/${locale}#work`, label: t('portfolio') },
    { href: `/${locale}/courses`, label: t('courses') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/request`, label: t('contact') },
  ];

  const isActive = (href: string) => {
    const clean = href.split('#')[0];
    if (clean === `/${locale}`) return pathname === clean;
    return Boolean(pathname?.startsWith(clean));
  };

  const onLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
    window.location.reload();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-ink-900/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent to-violet font-mono text-sm font-bold text-ink-900">
            SM
          </span>
          <span className="hidden text-sm font-semibold tracking-wide text-white/90 sm:block">
            sajadweb<span className="text-accent">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                isActive(l.href)
                  ? 'text-accent'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch />
          {loading ? null : user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href={user.role === 'ADMIN' ? `/${locale}/admin` : `/${locale}/dashboard`}
                className="btn-ghost !px-4 !py-2 text-xs"
              >
                {user.role === 'ADMIN' ? t('admin') : t('dashboard')}
              </Link>
              <button onClick={onLogout} className="text-xs text-white/60 hover:text-white">
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link href={`/${locale}/login`} className="btn-primary !px-5 !py-2 text-xs">
              {t('login')}
            </Link>
          )}
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-white lg:hidden"
          >
            <span className="text-lg">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink-900/95 px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={user.role === 'ADMIN' ? `/${locale}/admin` : `/${locale}/dashboard`}
                  className="rounded-lg px-4 py-3 text-sm text-accent hover:bg-white/5"
                >
                  {user.role === 'ADMIN' ? t('admin') : t('dashboard')}
                </Link>
                <button onClick={onLogout} className="rounded-lg px-4 py-3 text-start text-sm text-white/60">
                  {t('logout')}
                </button>
              </>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="mt-2 rounded-lg bg-gradient-to-r from-accent to-violet px-4 py-3 text-center text-sm font-semibold text-ink-900"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
