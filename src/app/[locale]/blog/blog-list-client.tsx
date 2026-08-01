'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

type Post = {
  slug: string;
  coverImage: string | null;
  createdAt: string;
  title: string;
  excerpt: string;
};

export function BlogListClient({ posts }: { posts: Post[] }) {
  const locale = useLocale();

  if (posts.length === 0) {
    return (
      <p className="col-span-full text-center text-white/50">
        No posts yet. Come back soon.
      </p>
    );
  }

  return (
    <>
      {posts.map((p) => (
        <Link key={p.slug} href={`/${locale}/blog/${p.slug}`} className="glass-card group h-full p-0 overflow-hidden">
          <div className="relative aspect-[16/9] overflow-hidden">
            {p.coverImage ? (
              <Image
                src={p.coverImage}
                alt={p.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-accent/20 to-violet/20" />
            )}
          </div>
          <div className="p-6">
            <time className="text-xs text-white/40">
              {new Date(p.createdAt).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h3 className="mt-2 text-lg font-semibold group-hover:text-accent">{p.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-white/60">{p.excerpt}</p>
          </div>
        </Link>
      ))}
    </>
  );
}
