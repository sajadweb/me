import { getTranslations } from 'next-intl/server';
import { RequestForm } from './request-form';

export async function generateMetadata() {
  const t = await getTranslations('Request');
  return { title: t('title') };
}

export default async function RequestPage() {
  const t = await getTranslations('Request');
  return (
    <div className="container-x min-h-screen py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">{t('kicker')}</span>
        <h1 className="section-title mt-2">{t('title')}</h1>
        <p className="mt-4 text-white/60">{t('subtitle')}</p>
      </div>
      <div className="mx-auto mt-10 max-w-xl">
        <RequestForm />
      </div>
    </div>
  );
}
