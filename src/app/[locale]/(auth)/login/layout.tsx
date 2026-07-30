import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Auth' });
  return { title: t('loginTitle') };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="relative min-h-screen pt-24">{children}</div>;
}
