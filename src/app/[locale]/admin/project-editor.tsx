'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import type { LocalizedProjectInput } from './admin-client';

type Project = {
  id: number;
  slug: string;
  coverImage: string | null;
  url: string | null;
  role: string | null;
  year: string | null;
  title: string;
  published: boolean;
  translations: LocalizedProjectInput[];
};

type ProjectFormState = {
  slug: string;
  coverImage: string;
  url: string;
  role: string;
  year: string;
  published: boolean;
  translations: Record<'en' | 'fa', {
    title: string;
    category: string;
    location: string;
    excerpt: string;
    body: string;
    techStack: string;
  }>;
};

const blankTranslation = {
  title: '',
  category: '',
  location: '',
  excerpt: '',
  body: '',
  techStack: '',
};

function makeForm(project?: Project): ProjectFormState {
  const en = project?.translations.find((t) => t.locale === 'en');
  const fa = project?.translations.find((t) => t.locale === 'fa');

  return {
    slug: project?.slug || '',
    coverImage: project?.coverImage || '',
    url: project?.url || '',
    role: project?.role || '',
    year: project?.year || '',
    published: project?.published ?? true,
    translations: {
      en: en
        ? {
            title: en.title,
            category: en.category,
            location: en.location || '',
            excerpt: en.excerpt,
            body: en.body,
            techStack: en.techStack,
          }
        : { ...blankTranslation },
      fa: fa
        ? {
            title: fa.title,
            category: fa.category,
            location: fa.location || '',
            excerpt: fa.excerpt,
            body: fa.body,
            techStack: fa.techStack,
          }
        : { ...blankTranslation },
    },
  };
}

export function ProjectEditor({ projects }: { projects: Project[] }) {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const [editing, setEditing] = useState<Project | null | 'new'>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-white/60">{projects.length} {t('projects')}</p>
        <button onClick={() => setEditing('new')} className="btn-primary !py-2 text-xs">
          + {t('newProject')}
        </button>
      </div>
      <div className="grid gap-3">
        {projects.map((p) => (
          <div key={p.id} className="glass-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                {p.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-white/40">/{p.slug}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-2 py-0.5 text-xs ${p.published ? 'bg-accent/10 text-accent' : 'bg-white/10 text-white/40'}`}>
                {p.published ? t('live') : t('draft')}
              </span>
              <Link href={`/${locale}/projects/${p.slug}`} className="text-xs text-accent hover:underline">
                {t('view')}
              </Link>
              <button onClick={() => setEditing(p)} className="btn-ghost !py-2 text-xs">
                {t('edit')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProjectModal
          project={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function ProjectModal({ project, onClose }: { project?: Project; onClose: () => void }) {
  const t = useTranslations('Admin');
  const [form, setForm] = useState<ProjectFormState>(() => makeForm(project));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const patchTranslation = (locale: 'en' | 'fa', updates: Partial<ProjectFormState['translations']['en']>) => {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], ...updates },
      },
    }));
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setForm((current) => ({ ...current, coverImage: data.url }));
  };

  const save = async () => {
    setSaving(true);
    setError('');
    const res = await fetch(project ? `/api/projects/${project.slug}` : '/api/projects', {
      method: project ? 'PATCH' : 'POST',
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
    if (!project || !confirm(t('deleteConfirm'))) return;
    await fetch(`/api/projects/${project.slug}`, { method: 'DELETE' });
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/80 p-4 backdrop-blur">
      <div className="glass max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">{project ? t('editProject') : t('newProject')}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">x</button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <InputRow label={t('slugField')} value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
          <InputRow label={t('urlField')} value={form.url} onChange={(v) => setForm({ ...form, url: v })} />
          <InputRow label={t('roleField')} value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
          <InputRow label={t('yearField')} value={form.year} onChange={(v) => setForm({ ...form, year: v })} />
          <InputRow label={t('coverUrl')} value={form.coverImage} onChange={(v) => setForm({ ...form, coverImage: v })} />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase text-white/50">{t('coverUpload')}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              className="text-sm text-white/60"
            />
            {uploading && <span className="text-xs text-accent">{t('uploading')}</span>}
          </label>
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
          {project && (
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
  value: {
    title: string;
    category: string;
    location: string;
    excerpt: string;
    body: string;
    techStack: string;
  };
  onChange: (updates: Partial<ProjectFormState['translations']['en']>) => void;
}) {
  const t = useTranslations('Admin');

  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">{title}</h3>
      <div className="grid gap-3">
        <InputRow label={t('titleField')} value={value.title} onChange={(v) => onChange({ title: v })} />
        <InputRow label={t('categoryField')} value={value.category} onChange={(v) => onChange({ category: v })} />
        <InputRow label={t('locationField')} value={value.location} onChange={(v) => onChange({ location: v })} />
        <InputRow label={t('excerptField')} value={value.excerpt} onChange={(v) => onChange({ excerpt: v })} />
        <InputRow label={t('techStackField')} value={value.techStack} onChange={(v) => onChange({ techStack: v })} />
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
