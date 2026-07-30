import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureAdminFromDb } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await ensureAdminFromDb(req);
    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported type' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${randomUUID()}.${ext}`;
    await writeFile(path.join(dir, filename), bytes);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error('[upload]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
