export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/session';

import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Fetch resources error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    // Only ADMIN can post resources
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, url, category } = await req.json();

    if (!title || !description || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resource = await prisma.resource.create({
      data: { title, description, url, category: category || 'General' }
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Create resource error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
