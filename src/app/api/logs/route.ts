import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { z } from "zod";


const logSchema = z.object({
  reportOfDay: z.string().min(1, "Report must be at least 1 character"),
  learningOfDay: z.string().min(1, "Learning must be at least 1 character"),
  meetingOfDay: z.string().min(1, "Meeting must be at least 1 character"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || (session.user as any).role !== "INTERN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    // Validate with Zod
    const validatedData = logSchema.parse(body);

    // Fetch the intern profile based on userId
    const profile = await prisma.internProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return NextResponse.json({ error: "Intern profile not found" }, { status: 404 });
    }

    // Create the Daily Report in the DB
    const report = await prisma.dailyReport.create({
      data: {
        internId: profile.id,
        reportOfDay: validatedData.reportOfDay,
        learningOfDay: validatedData.learningOfDay,
        meetingOfDay: validatedData.meetingOfDay,
      }
    });

    // Award +50 XP
    await prisma.internProfile.update({
      where: { id: profile.id },
      data: { xp: { increment: 50 } }
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit log", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.dailyReport.findMany({
      where: {
        intern: {
          adminId: (session.user as any).id
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        intern: {
          select: {
            id: true,
            name: true,
            photoUrl: true
          }
        }
      }
    });

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch logs", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

