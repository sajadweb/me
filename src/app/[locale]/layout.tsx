import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Vazirmatn } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';
import { isLocale, loadMessages, locales } from '../../i18n';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SessionProvider } from '@/components/session-provider';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const vazir = Vazirmatn({ subsets: ['arabic', 'latin'], variable: '--font-fa', display: 'swap' });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: {
      default: t('title'),
      template: `%s · Sajjad Mohammadi Nejad`,
    },
    description: t('description'),
    keywords: [
      'NestJS',
      'Go',
      'Golang',
      'Node.js',
      'Backend',
      'Microservices',
      'Sajjad Mohammadi Nejad',
      'sajadweb',
      'AI',
      'Web3',
    ],
    authors: [{ name: 'Sajjad Mohammadi Nejad' }],
    metadataBase: new URL('https://sajadweb.ir'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = await loadMessages(locale);
  const dir = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${mono.variable} ${vazir.variable}`}>
      <body className="relative min-h-screen overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>
            <div className="relative z-10 flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
