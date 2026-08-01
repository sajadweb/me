'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { LocalizedCourseInput } from './admin-client';

type Course = {
  id: number;
  slug: string;
  category: string;
  title: string;
  level: string;
  sortOrder: number;
  published: boolean;
  translations: LocalizedCourseInput[];
};

type CourseFormState = {
  slug: string;
  category: string;
  level: string;
  sortOrder: number;
  published: boolean;
  translations: Record<'en' | 'fa', { title: string; excerpt: string; body: string; duration: string }>;
};

const blankTranslation = { title: '', excerpt: '', body: '', duration: '' };

function makeForm(course?: Course): CourseFormState {
  const en = course?.translations.find((t) => t.locale === 'en');
  const fa = course?.translations.find((t) => t.locale === 'fa');

  return {
    slug: course?.slug || '',
    category: course?.category || 'backend',
    level: course?.level || 'intermediate',
    sortOrder: course?.sortOrder || 0,
    published: course?.published ?? true,
    translations: {
      en: en ? { title: en.title, excerpt: en.excerpt, body: en.body, duration: en.duration || '' } : { ...blankTranslation },
      fa: fa ? { title: fa.title, excerpt: fa.excerpt, body: fa.body, duration: fa.duration || '' } : { ...blankTranslation },
    },
  };
}

export function CourseEditor({ courses }: { courses: Course[] }) {
  const t = useTranslations('Admin');
  const [editing, setEditing] = useState<Course | null | 'new'>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-white/60">{courses.length} {t('courses')}</p>
        <button onClick={() => setEditing('new')} className="btn-primary !py-2 text-xs">
          + {t('newCourse')}
        </button>
      </div>
      <div className="grid gap-3">
        {courses.map((c) => (
          <div key={c.id} className="glass-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{c.title}</p>
              <p className="text-xs text-white/40">/{c.slug}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-violet/10 px-2 py-0.5 text-xs text-violet">
                {c.level}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${c.published ? 'bg-accent/10 text-accent' : 'bg-white/10 text-white/40'}`}>
                {c.published ? t('live') : t('draft')}
              </span>
              <button onClick={() => setEditing(c)} className="btn-ghost !py-2 text-xs">
                {t('edit')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <CourseModal
          course={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function CourseModal({ course, onClose }: { course?: Course; onClose: () => void }) {
  const t = useTranslations('Admin');
  const [form, setForm] = useState<CourseFormState>(() => makeForm(course));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const patchTranslation = (locale: 'en' | 'fa', updates: Partial<CourseFormState['translations']['en']>) => {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], ...updates },
      },
    }));
  };

  const save = async () => {
    setSaving(true);
    setError('');
    const res = await fetch(course ? `/api/courses/${course.slug}` : '/api/courses', {
      method: course ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || t('saveFailed'));
      return;
    }
    window.location.reload();
  };

  const remove = async () => {
    if (!course || !confirm(t('deleteConfirm'))) return;
    await fetch(`/api/courses/${course.slug}`, { method: 'DELETE' });
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/80 p-4 backdrop-blur">
      <div className="glass max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">{course ? t('editCourse') : t('newCourse')}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">x</button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <InputRow label={t('slugField')} value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
          <InputRow label={t('categoryField')} value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <InputRow label={t('levelField')} value={form.level} onChange={(v) => setForm({ ...form, level: v })} />
          <InputRow label={t('sortOrderField')} value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
          <label className="flex items-center gap-2 text-sm lg:col-span-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            {t('publishedField')}
          </label>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <TranslationFields title="English" value={form.translations.en} onChange={(updates) => patchTranslation('en', updates)} />
          <TranslationFields title="فارسی" value={form.translations.fa} onChange={(updates) => patchTranslation('fa', updates)} />
        </div>

        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {course && (
            <button onClick={remove} className="rounded-full border border-red-400/30 px-5 py-2 text-xs text-red-300 hover:bg-red-400/10">
              {t('delete')}
            </button>
          )}
          <button onClick={onClose} className="btn-ghost !py-2 text-xs">
            {t('cancel')}
          </button>
          <button onClick={save} disabled={saving} className="btn-primary !py-2 text-xs">
            {saving ? '...' : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}

function TranslationFields({
  title,
  value,
  onChange,
}: {
  title: string;
  value: { title: string; excerpt: string; body: string; duration: string };
  onChange: (updates: Partial<{ title: string; excerpt: string; body: string; duration: string }>) => void;
}) {
  const t = useTranslations('Admin');

  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">{title}</h3>
      <div className="grid gap-3">
        <InputRow label={t('titleField')} value={value.title} onChange={(v) => onChange({ title: v })} />
        <InputRow label={t('excerptField')} value={value.excerpt} onChange={(v) => onChange({ excerpt: v })} />
        <InputRow label={t('durationField')} value={value.duration} onChange={(v) => onChange({ duration: v })} />
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase text-white/50">{t('bodyField')}</span>
          <textarea
            rows={8}
            value={value.body}
            onChange={(e) => onChange({ body: e.target.value })}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-accent/50"
          />
        </label>
      </div>
    </div>
  );
}

function InputRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
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
