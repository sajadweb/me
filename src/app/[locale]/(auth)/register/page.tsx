import { getTranslations } from 'next-intl/server';
import { RegisterForm } from './register-form';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Auth' });
  return { title: t('registerTitle') };
}

export default function RegisterPage() {
  return <RegisterForm />;
}
