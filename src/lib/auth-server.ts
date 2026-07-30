import { cookies } from 'next/headers';
import { verifyToken, type SessionUser } from './auth';

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get('sw_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return user;
}
