'use client';

import { useEffect } from 'react';

export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.transitionDelay = `${delay}ms`;
            e.target.classList.add('is-visible');
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [delay]);

  return (
    <Tag data-reveal className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
