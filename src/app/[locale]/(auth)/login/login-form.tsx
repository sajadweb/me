'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSession } from '@/components/session-provider';
import { AuthCard } from '../auth-card';

export function LoginForm() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const router = useRouter();
  const { refresh } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError(t('invalidCredentials'));
      return;
    }
    await refresh();
    router.push(`/${locale}/dashboard`);
    router.refresh();
  };

  return (
    <AuthCard title={t('loginTitle')} subtitle={t('loginSubtitle')}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field
          label={t('email')}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <Field
          label={t('password')}
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? '...' : t('submitLogin')}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/60">
        {t('noAccount')}{' '}
        <Link href={`/${locale}/register`} className="text-accent hover:underline">
          {t('register')}
        </Link>
      </p>
    </AuthCard>
  );
}

export function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-white/50">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition-colors focus:border-accent/50"
      />
    </label>
  );
}
