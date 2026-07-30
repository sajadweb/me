import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, ctx: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: ctx.params.slug },
    include: {
      translations: true,
      comments: { orderBy: { createdAt: 'desc' }, where: { userId: { not: undefined } } },
    },
  });
  if (!post || !post.published) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ post });
}
