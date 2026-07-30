'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSession } from '@/components/session-provider';

type Course = { id: number; slug: string; level: string; duration: string; title: string; excerpt: string };

export function CoursesClient({ courses }: { courses: Course[] }) {
  const t = useTranslations('Courses');
  const locale = useLocale();
  const { user } = useSession();
  const [enrolled, setEnrolled] = useState<number[]>([]);
  const [busy, setBusy] = useState<number | null>(null);

  const enroll = async (id: number) => {
    if (!user) {
      window.location.href = `/${locale}/login`;
      return;
    }
    setBusy(id);
    await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: id }),
    });
    setEnrolled((prev) => [...new Set([...prev, id])]);
    setBusy(null);
  };

  if (courses.length === 0) {
    return (
      <p className="md:col-span-2 text-center text-white/50">
        Courses will appear here. The admin can add them from the admin panel.
      </p>
    );
  }

  return (
    <>
      {courses.map((c) => (
        <article key={c.id} className="glass-card group h-full">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
              {t(`levels.${c.level}` as never)}
            </span>
            {c.duration && (
              <span className="text-xs text-white/40">
                {c.duration} · {t('duration')}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold group-hover:text-accent">{c.title}</h3>
          <p className="mt-2 text-sm text-white/60">{c.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/courses/${c.slug}`}
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 hover:border-accent/50 hover:text-accent"
            >
              {t('viewCourse')}
            </Link>
            <button
              onClick={() => enroll(c.id)}
              disabled={busy === c.id}
              className="btn-primary !px-5 !py-2 text-xs"
            >
              {enrolled.includes(c.id)
                ? t('enrolled')
                : user
                  ? t('enroll')
                  : t('loginToEnroll')}
            </button>
          </div>
        </article>
      ))}
    </>
  );
}
