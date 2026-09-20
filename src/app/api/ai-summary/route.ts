export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/session';

import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch today's reports
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reports = await prisma.dailyReport.findMany({
      where: {
        createdAt: {
          gte: today,
        }
      },
      include: {
        intern: { select: { name: true } }
      }
    });

    if (reports.length === 0) {
      return NextResponse.json({ summary: "No reports submitted today yet." });
    }

    // Simulated AI Summary Logic (Mock)
    const blockers = reports.filter((r: any) => r.meetingOfDay.toLowerCase().includes('block')).map((r: any) => r.intern.name);
    
    let summaryText = "\n? **AI Standup Summary** ?\n\n";
    summaryText += "**Team Progress:** " + reports.length + " intern(s) submitted their reports today. The team is making steady progress.\n\n";
    
    if (blockers.length > 0) {
      summaryText += "**?? Attention Needed:** " + blockers.join(', ') + " reported potential blockers in their logs today.\n\n";
    } else {
      summaryText += "**? No Blockers:** The team reported no major blockers today.\n\n";
    }

    summaryText += "**Key Learnings:** The team learned about various topics including \"" + reports[0].learningOfDay.substring(0, 50) + "...\"";

    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ summary: summaryText });
  } catch (error) {
    console.error('AI Summary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
