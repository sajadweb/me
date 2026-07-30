import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureAdminFromDb } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await ensureAdminFromDb(req);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }

  const [requests, enrollments, users, posts, courses] = await Promise.all([
    prisma.serviceRequest.count(),
    prisma.enrollment.count(),
    prisma.user.count(),
    prisma.blogPost.count(),
    prisma.course.count(),
  ]);

  const recentRequests = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  return NextResponse.json({
    counts: { requests, enrollments, users, posts, courses },
    recentRequests,
  });
}
