import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'fa'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const messages = {
  en: () => import('../src/messages/en.json'),
  fa: () => import('../src/messages/fa.json'),
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();
  return {
    messages: (await messages[locale as Locale]()).default,
  };
});
