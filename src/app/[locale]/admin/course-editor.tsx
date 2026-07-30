'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Course = { id: number; slug: string; title: string; level: string };

export function CourseEditor({ courses }: { courses: Course[] }) {
  const t = useTranslations('Admin');
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-white/60">{courses.length} courses</p>
        <button onClick={() => setOpen(true)} className="btn-primary !py-2 text-xs">
          + {t('newCourse')}
        </button>
      </div>
      <div className="grid gap-3">
        {courses.map((c) => (
          <div key={c.id} className="glass-card flex items-center justify-between">
            <div>
              <p className="font-medium">{c.title}</p>
              <p className="text-xs text-white/40">/{c.slug}</p>
            </div>
            <span className="rounded-full bg-violet/10 px-2 py-0.5 text-xs text-violet">
              {c.level}
            </span>
          </div>
        ))}
      </div>

      {open && <NewCourseModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function NewCourseModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations('Admin');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    level: 'intermediate',
    duration: '',
    category: 'backend',
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setDone(true);
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/80 p-4 backdrop-blur">
      <div className="glass w-full max-w-lg rounded-2xl p-6">
        {done ? (
          <p className="text-center text-accent">✓ Saved</p>
        ) : (
          <>
            <h2 className="text-lg font-bold">{t('newCourse')}</h2>
            <div className="mt-4 grid gap-3">
              <Row label={t('titleField')} value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <Row label={t('slugField')} value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
              <Row label={t('excerptField')} value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} />
              <Row label="Level" value={form.level} onChange={(v) => setForm({ ...form, level: v })} />
              <Row label="Duration" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
              <Row label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={onClose} className="btn-ghost !py-2 text-xs">
                {t('cancel')}
              </button>
              <button onClick={save} disabled={saving} className="btn-primary !py-2 text-xs">
                {saving ? '...' : t('save')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase text-white/50">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm outline-none focus:border-accent/50"
      />
    </label>
  );
}
