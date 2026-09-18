import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { upcomingProjectTitle, upcomingProjectDesc, upcomingProjectDate } = await req.json();
    const updatedIntern = await prisma.internProfile.update({
      where: { userId: params.id },
      data: { upcomingProjectTitle, upcomingProjectDesc, upcomingProjectDate }
    });
    return NextResponse.json(updatedIntern);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}