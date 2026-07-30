'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSession } from '@/components/session-provider';
import { AuthCard } from '../auth-card';
import { Field } from '../login/login-form';

export function RegisterForm() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const router = useRouter();
  const { refresh } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError(t('confirmPassword'));
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });
    setLoading(false);
    if (res.status === 409) {
      setError(t('emailExists'));
      return;
    }
    if (!res.ok) {
      setError('Error');
      return;
    }
    await refresh();
    router.push(`/${locale}/dashboard`);
    router.refresh();
  };

  return (
    <AuthCard title={t('registerTitle')} subtitle={t('registerSubtitle')}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label={t('name')} type="text" value={name} onChange={setName} placeholder="Jane Doe" />
        <Field
          label={t('email')}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <Field label={t('phone')} type="tel" value={phone} onChange={setPhone} placeholder="+98..." />
        <Field
          label={t('password')}
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />
        <Field
          label={t('confirmPassword')}
          type="password"
          value={confirm}
          onChange={setConfirm}
          placeholder="••••••••"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? '...' : t('submitRegister')}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/60">
        {t('hasAccount')}{' '}
        <Link href={`/${locale}/login`} className="text-accent hover:underline">
          {t('login')}
        </Link>
      </p>
    </AuthCard>
  );
}
