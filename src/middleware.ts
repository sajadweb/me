import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';

const intl = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  return intl(req);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
