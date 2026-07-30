'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '../i18n';

export function LocaleSwitch() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Common');
  const router = useRouter();
  const pathname = usePathname();

  const next = locale === 'en' ? 'fa' : 'en';

  const onToggle = () => {
    const segments = (pathname ?? '').split('/');
    if (segments[1] && locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join('/') || `/${next}`);
  };

  return (
    <button
      onClick={onToggle}
      className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-xs text-white/80 transition-colors hover:border-accent/50 hover:text-accent"
      aria-label="Switch language"
    >
      {locale === 'en' ? 'فا' : 'EN'}
    </button>
  );
}
