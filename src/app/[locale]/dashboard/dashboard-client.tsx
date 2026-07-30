'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import type { SessionUser } from '@/lib/auth';

type Props = {
  user: SessionUser;
  enrollments: { id: number; status: string; course: { slug: string; title: string } }[];
  requests: { id: number; type: string; status: string; message: string; createdAt: string }[];
};

export function DashboardClient({ user, enrollments, requests }: Props) {
  const t = useTranslations('Dashboard');
  const tReq = useTranslations('Request');
  const locale = useLocale();
  const [tab, setTab] = useState<'courses' | 'requests'>('courses');

  return (
    <div className="container-x min-h-screen py-28">
      <div className="mb-10">
        <span className="section-kicker">{t('kicker')}</span>
        <h1 className="mt-2 text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 text-white/60">{t('welcome', { name: user.name })}</p>
      </div>

      <div className="mb-8 inline-flex rounded-full border border-white/10 p-1 text-sm">
        {(['courses', 'requests'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full px-5 py-2 transition-colors ${
              tab === k ? 'bg-gradient-to-r from-accent to-violet text-ink-900' : 'text-white/70'
            }`}
          >
            {k === 'courses' ? t('enrollmentsTitle') : t('requestsTitle')}
          </button>
        ))}
      </div>

      {tab === 'courses' && (
        <div className="grid gap-4">
          {enrollments.length === 0 ? (
            <div className="glass-card text-center">
              <p className="text-white/60">{t('noEnrollments')}</p>
              <Link href={`/${locale}/courses`} className="btn-primary mt-4 inline-flex">
                {t('browseCourses')}
              </Link>
            </div>
          ) : (
            enrollments.map((e) => (
              <div key={e.id} className="glass-card flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{e.course.title}</h3>
                  <p className="text-sm text-white/50">/{e.course.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
                    {t(`status.${e.status}` as never)}
                  </span>
                  <Link
                    href={`/${locale}/courses/${e.course.slug}`}
                    className="text-sm text-accent hover:underline"
                  >
                    →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'requests' && (
        <div className="grid gap-4">
          {requests.length === 0 ? (
            <div className="glass-card text-center">
              <p className="text-white/60">{t('noRequests')}</p>
              <Link href={`/${locale}/request`} className="btn-primary mt-4 inline-flex">
                {tReq('submit')}
              </Link>
            </div>
          ) : (
            requests.map((r) => (
              <div key={r.id} className="glass-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{tReq(`types.${r.type}` as never)}</h3>
                  <span className="rounded-full bg-violet/10 px-3 py-1 text-xs text-violet">
                    {t(`status.${r.status}` as never)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/60">{r.message}</p>
                <p className="mt-2 text-xs text-white/30">
                  {new Date(r.createdAt).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
