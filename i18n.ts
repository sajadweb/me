import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'fa'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default,
  };
});
