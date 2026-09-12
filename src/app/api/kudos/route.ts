import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET all kudos for the feed
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const kudos = await prisma.kudo.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        sender: { select: { id: true, email: true } },
        receiver: { select: { id: true, email: true } }
      }
    });

    return NextResponse.json(kudos);
  } catch (error) {
    console.error('Fetch kudos error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST a new kudo
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { message, receiverId } = body;
    const senderId = (session.user as any).id;

    if (!message || !receiverId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const kudo = await prisma.kudo.create({
      data: {
        message,
        senderId,
        receiverId
      },
      include: {
        sender: { select: { id: true, email: true } },
        receiver: { select: { id: true, email: true } }
      }
    });

    return NextResponse.json(kudo);
  } catch (error) {
    console.error('Create kudo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
