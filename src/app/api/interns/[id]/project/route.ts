import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const cleanId = id.startsWith("intern-") ? id.replace("intern-", "") : id;
    const ownershipCheck = await prisma.internProfile.findUnique({ where: { userId: cleanId } });
    if (!ownershipCheck || ownershipCheck.adminId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Intern does not belong to you" }, { status: 403 });
    }
  
    const { upcomingProjectTitle, upcomingProjectDesc, upcomingProjectDate } = await req.json();
    const updatedIntern = await prisma.internProfile.update({
      where: { userId: cleanId },
      data: { upcomingProjectTitle, upcomingProjectDesc, upcomingProjectDate }
    });
    return NextResponse.json(updatedIntern);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}