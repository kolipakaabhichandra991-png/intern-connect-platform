const fs = require('fs');
fs.mkdirSync('src/app/api/interns/[internId]/project', { recursive: true });
const code = `import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { internId: string } }) {
  try {
    const { upcomingProjectTitle, upcomingProjectDesc, upcomingProjectDate } = await req.json();
    const updatedIntern = await prisma.internProfile.update({
      where: { userId: params.internId },
      data: { upcomingProjectTitle, upcomingProjectDesc, upcomingProjectDate }
    });
    return NextResponse.json(updatedIntern);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}`;
fs.writeFileSync('src/app/api/interns/[internId]/project/route.ts', code);
console.log('Created API route');
