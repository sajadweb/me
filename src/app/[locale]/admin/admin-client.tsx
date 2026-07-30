'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { PostEditor } from './post-editor';
import { CourseEditor } from './course-editor';

type Props = {
  requests: {
    id: number;
    name: string;
    email: string;
    type: string;
    message: string;
    status: string;
    createdAt: string;
  }[];
  enrollments: { id: number; userName: string; courseTitle: string; status: string; createdAt: string }[];
  users: { id: number; name: string; email: string; role: string }[];
  posts: { id: number; slug: string; title: string; published: boolean }[];
  courses: { id: number; slug: string; title: string; level: string }[];
};

type Tab = 'overview' | 'requests' | 'enrollments' | 'users' | 'posts' | 'courses';

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
      </div>
    </div>
  );
}

function Overview(props: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Stat label="Requests" value={props.requests.length} />
      <Stat label="Enrollments" value={props.enrollments.length} />
      <Stat label="Users" value={props.users.length} />
      <Stat label="Posts" value={props.posts.length} />
      <Stat label="Courses" value={props.courses.length} />
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
  return (
    <div className="glass-card overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase text-white/40">
            <th className="p-4">Name</th>
            <th className="p-4">Type</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
            <th className="p-4">Message</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="border-b border-white/5">
              <td className="p-4">
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-white/40">{r.email}</div>
              </td>
              <td className="p-4 capitalize">{r.type}</td>
              <td className="p-4">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                  {r.status}
                </span>
              </td>
              <td className="p-4 text-white/50">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 text-white/60">{r.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EnrollmentsTable({ items }: { items: Props['enrollments'] }) {
  return (
    <div className="glass-card overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase text-white/40">
            <th className="p-4">User</th>
            <th className="p-4">Course</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e.id} className="border-b border-white/5">
              <td className="p-4">{e.userName}</td>
              <td className="p-4">{e.courseTitle}</td>
              <td className="p-4">
                <span className="rounded-full bg-violet/10 px-2 py-0.5 text-xs text-violet">
                  {e.status}
                </span>
              </td>
              <td className="p-4 text-white/50">{new Date(e.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTable({ items }: { items: Props['users'] }) {
  return (
    <div className="glass-card overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase text-white/40">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id} className="border-b border-white/5">
              <td className="p-4">{u.name}</td>
              <td className="p-4 text-white/60">{u.email}</td>
              <td className="p-4">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    u.role === 'ADMIN'
                      ? 'bg-magenta/20 text-magenta'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
