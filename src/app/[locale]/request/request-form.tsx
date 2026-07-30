'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSession } from '@/components/session-provider';

export function RequestForm() {
  const t = useTranslations('Request');
  const locale = useLocale();
  const { user } = useSession();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    type: 'consulting',
    budget: '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="glass-card text-center">
        <p className="text-2xl">✓</p>
        <p className="mt-2 text-lg font-semibold">{t('success')}</p>
        <p className="mt-2 text-sm text-white/60">{t('dashboardCta')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-card flex flex-col gap-4">
      <Input label={t('name')} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <Input
        label={t('email')}
        type="email"
        value={form.email}
        onChange={(v) => setForm({ ...form, email: v })}
      />
      <Input label={t('phone')} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wider text-white/50">{t('type')}</span>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm outline-none focus:border-accent/50"
        >
          {['consulting', 'web', 'training', 'ai', 'review'].map((k) => (
            <option key={k} value={k}>
              {t(`types.${k}`)}
            </option>
          ))}
        </select>
      </label>

      <Input
        label={t('budget')}
        value={form.budget}
        onChange={(v) => setForm({ ...form, budget: v })}
      />

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wider text-white/50">{t('message')}</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-accent/50"
        />
      </label>

      <button type="submit" disabled={loading} className="btn-primary mt-2">
        {loading ? '...' : t('submit')}
      </button>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-white/50">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-accent/50"
      />
    </label>
  );
}
