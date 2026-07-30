import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { prisma } from './prisma';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-me-please-very-long',
);
const COOKIE = 'sw_session';
const ONE_MONTH = 30 * 24 * 60 * 60;

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export async function signToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(req?: NextRequest): Promise<SessionUser | null> {
  const cookieSource = req
    ? req.cookies.get(COOKIE)?.value
    : typeof document !== 'undefined'
      ? document.cookie
          .split('; ')
          .find((c) => c.startsWith(`${COOKIE}=`))
          ?.split('=')[1]
      : undefined;

  if (!cookieSource) return null;
  return verifyToken(cookieSource);
}

export async function getSessionFromCookies(): Promise<SessionUser | null> {
  if (typeof document === 'undefined') return null;
  const token = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.split('=')[1];
  if (!token) return null;
  return verifyToken(token);
}

export async function requireUser(req: NextRequest): Promise<SessionUser> {
  const user = await getSession(req);
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function requireAdmin(req: NextRequest): Promise<SessionUser> {
  const user = await requireUser(req);
  if (user.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return user;
}

export async function ensureAdminFromDb(req: NextRequest): Promise<SessionUser> {
  const user = await getSession(req);
  if (!user) throw new Error('UNAUTHORIZED');
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || dbUser.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return { ...user, role: dbUser.role as 'ADMIN' };
}

export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_MONTH,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.delete(COOKIE);
}

export const SESSION_COOKIE = COOKIE;
