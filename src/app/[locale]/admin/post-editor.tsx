'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Post = { id: number; slug: string; title: string; published: boolean };

export function PostEditor({ posts }: { posts: Post[] }) {
  const t = useTranslations('Admin');
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-white/60">{posts.length} posts</p>
        <button onClick={() => setOpen(true)} className="btn-primary !py-2 text-xs">
          + {t('newPost')}
        </button>
      </div>

      <div className="grid gap-3">
        {posts.map((p) => (
          <div key={p.id} className="glass-card flex items-center justify-between">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-white/40">/{p.slug}</p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                p.published ? 'bg-accent/10 text-accent' : 'bg-white/10 text-white/40'
              }`}
            >
              {p.published ? 'live' : 'draft'}
            </span>
          </div>
        ))}
      </div>

      {open && <NewPostModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function NewPostModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations('Admin');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    coverUrl: '',
    published: true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const onUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setForm((f) => ({ ...f, coverUrl: data.url }));
  };

  const save = async () => {
    setSaving(true);
    await fetch('/api/blog', {
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
            <h2 className="text-lg font-bold">{t('newPost')}</h2>
            <div className="mt-4 grid gap-3">
              <InputRow label={t('titleField')} value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <InputRow label={t('slugField')} value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
              <InputRow label={t('excerptField')} value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} />
              <InputRow label={t('coverUrl')} value={form.coverUrl} onChange={(v) => setForm({ ...form, coverUrl: v })} />
              <label className="flex flex-col gap-1.5">
                <span className="text-xs uppercase text-white/50">{t('coverUpload')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                  className="text-sm text-white/60"
                />
                {uploading && <span className="text-xs text-accent">Uploading...</span>}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs uppercase text-white/50">{t('bodyField')}</span>
                <textarea
                  rows={6}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-accent/50"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                {t('publishedField')}
              </label>
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

function InputRow({
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
