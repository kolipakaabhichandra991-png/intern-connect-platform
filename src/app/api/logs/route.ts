import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const logSchema = z.object({
  reportOfDay: z.string().min(10, "Report must be at least 10 characters"),
  learningOfDay: z.string().min(10, "Learning must be at least 10 characters"),
  meetingOfDay: z.string().min(5, "Meeting description must be at least 5 characters"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
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
