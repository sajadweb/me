'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { PostEditor } from './post-editor';
import { CourseEditor } from './course-editor';
import { ProjectEditor } from './project-editor';

type Locale = 'en' | 'fa';

export type LocalizedPostInput = {
  locale: string;
  title: string;
  excerpt: string;
  body: string;
};

export type LocalizedCourseInput = LocalizedPostInput & {
  duration: string | null;
};

export type LocalizedProjectInput = {
  locale: string;
  title: string;
  category: string;
  location: string | null;
  excerpt: string;
  body: string;
  techStack: string;
};

type Props = {
  requests: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    type: string;
    budget: string | null;
    message: string;
    status: string;
    createdAt: string;
  }[];
  enrollments: { id: number; userName: string; courseTitle: string; status: string; createdAt: string }[];
  users: { id: number; name: string; email: string; phone: string | null; role: string }[];
  posts: {
    id: number;
    slug: string;
    coverImage: string | null;
    title: string;
    published: boolean;
    translations: LocalizedPostInput[];
  }[];
  courses: {
    id: number;
    slug: string;
    category: string;
    title: string;
    level: string;
    sortOrder: number;
    published: boolean;
    translations: LocalizedCourseInput[];
  }[];
  projects: {
    id: number;
    slug: string;
    coverImage: string | null;
    url: string | null;
    role: string | null;
    year: string | null;
    title: string;
    published: boolean;
    translations: LocalizedProjectInput[];
  }[];
};

type Tab = 'overview' | 'requests' | 'enrollments' | 'users' | 'posts' | 'courses' | 'projects';

export function AdminClient(props: Props) {
  const t = useTranslations('Admin');
  const [tab, setTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: t('overview') },
    { id: 'requests', label: t('requests') },
    { id: 'enrollments', label: t('enrollments') },
    { id: 'users', label: t('users') },
    { id: 'posts', label: t('posts') },
    { id: 'courses', label: t('courses') },
    { id: 'projects', label: t('projects') },
  ];

  return (
    <div className="container-x min-h-screen py-28">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              tab === tabItem.id
                ? 'bg-gradient-to-r from-accent to-violet text-ink-900'
                : 'border border-white/10 text-white/70 hover:border-accent/40'
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'overview' && <Overview {...props} />}
        {tab === 'requests' && <RequestsTable items={props.requests} />}
        {tab === 'enrollments' && <EnrollmentsTable items={props.enrollments} />}
        {tab === 'users' && <UsersTable items={props.users} />}
        {tab === 'posts' && <PostEditor posts={props.posts} />}
        {tab === 'courses' && <CourseEditor courses={props.courses} />}
        {tab === 'projects' && <ProjectEditor projects={props.projects} />}
      </div>
    </div>
  );
}

function Overview(props: Props) {
  const t = useTranslations('Admin');

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Stat label={t('requests')} value={props.requests.length} />
      <Stat label={t('enrollments')} value={props.enrollments.length} />
      <Stat label={t('users')} value={props.users.length} />
      <Stat label={t('posts')} value={props.posts.length} />
      <Stat label={t('courses')} value={props.courses.length} />
      <Stat label={t('projects')} value={props.projects.length} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card">
      <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-2 text-3xl font-bold text-accent">{value}</p>
    </div>
  );
}

function RequestsTable({ items }: { items: Props['requests'] }) {
  const t = useTranslations('Admin');
  const locale = useLocale() as Locale;
  const [rows, setRows] = useState(items);

  const updateStatus = async (id: number, status: string) => {
    setRows((current) => current.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div className="glass-card overflow-x-auto p-0">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase text-white/40 rtl:text-right">
            <th className="p-4">{t('nameField')}</th>
            <th className="p-4">{t('typeField')}</th>
            <th className="p-4">{t('budgetField')}</th>
            <th className="p-4">{t('statusField')}</th>
            <th className="p-4">{t('dateField')}</th>
            <th className="p-4">{t('messageField')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-white/5 align-top">
              <td className="p-4">
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-white/40">{r.email}</div>
                {r.phone && <div className="text-xs text-white/40">{r.phone}</div>}
              </td>
              <td className="p-4 capitalize">{r.type}</td>
              <td className="p-4 text-white/50">{r.budget || '-'}</td>
              <td className="p-4">
                <Select value={r.status} options={['NEW', 'REVIEW', 'DONE']} onChange={(v) => updateStatus(r.id, v)} />
              </td>
              <td className="p-4 text-white/50">
                {new Date(r.createdAt).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}
              </td>
              <td className="max-w-sm p-4 text-white/60">{r.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EnrollmentsTable({ items }: { items: Props['enrollments'] }) {
  const t = useTranslations('Admin');
  const locale = useLocale() as Locale;
  const [rows, setRows] = useState(items);

  const updateStatus = async (id: number, status: string) => {
    setRows((current) => current.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/admin/enrollments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div className="glass-card overflow-x-auto p-0">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase text-white/40 rtl:text-right">
            <th className="p-4">{t('userField')}</th>
            <th className="p-4">{t('courseField')}</th>
            <th className="p-4">{t('statusField')}</th>
            <th className="p-4">{t('dateField')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id} className="border-b border-white/5">
              <td className="p-4">{e.userName}</td>
              <td className="p-4">{e.courseTitle}</td>
              <td className="p-4">
                <Select value={e.status} options={['PENDING', 'ACTIVE', 'DONE']} onChange={(v) => updateStatus(e.id, v)} />
              </td>
              <td className="p-4 text-white/50">
                {new Date(e.createdAt).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTable({ items }: { items: Props['users'] }) {
  const t = useTranslations('Admin');
  const [rows, setRows] = useState(items);
  const [saving, setSaving] = useState<number | null>(null);

  const patchRow = (id: number, updates: Partial<Props['users'][number]>) => {
    setRows((current) => current.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const save = async (row: Props['users'][number]) => {
    setSaving(row.id);
    await fetch(`/api/admin/users/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
    setSaving(null);
  };

  return (
    <div className="glass-card overflow-x-auto p-0">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase text-white/40 rtl:text-right">
            <th className="p-4">{t('nameField')}</th>
            <th className="p-4">{t('emailField')}</th>
            <th className="p-4">{t('phoneField')}</th>
            <th className="p-4">{t('roleField')}</th>
            <th className="p-4">{t('actionsField')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className="border-b border-white/5">
              <td className="p-4">
                <InlineInput value={u.name} onChange={(v) => patchRow(u.id, { name: v })} />
              </td>
              <td className="p-4">
                <InlineInput value={u.email} type="email" onChange={(v) => patchRow(u.id, { email: v })} />
              </td>
              <td className="p-4">
                <InlineInput value={u.phone || ''} onChange={(v) => patchRow(u.id, { phone: v })} />
              </td>
              <td className="p-4">
                <Select value={u.role} options={['USER', 'ADMIN']} onChange={(v) => patchRow(u.id, { role: v })} />
              </td>
              <td className="p-4">
                <button onClick={() => save(u)} className="btn-primary !px-4 !py-2 text-xs" disabled={saving === u.id}>
                  {saving === u.id ? '...' : t('save')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-white/10 bg-ink-800 px-3 py-2 text-xs text-white/80 outline-none focus:border-accent/50"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function InlineInput({
  value,
  onChange,
  type = 'text',
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80 outline-none focus:border-accent/50"
    />
  );
}
