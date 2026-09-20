import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { id } = await params;
    // id could be "intern-1234", so let's strip "intern-" if present
    const cleanId = id.startsWith("intern-") ? id.replace("intern-", "") : id;

    const ownershipCheck = await prisma.internProfile.findUnique({ where: { id: cleanId } });
    if (!ownershipCheck || ownershipCheck.adminId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Intern does not belong to you" }, { status: 403 });
    }
    const intern = await prisma.internProfile.findUnique({
      where: { id: cleanId },
      include: {
        user: { select: { email: true } },
        dailyReports: true,
      }
    });

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    return NextResponse.json(intern);
  } catch (error) {
    console.error("Failed to fetch intern:", error);
    return NextResponse.json({ error: "Failed to fetch intern" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { id } = await params;
    const cleanId = id.startsWith("intern-") ? id.replace("intern-", "") : id;
    const body = await req.json();

    // Whitelist allowed fields to update
    const allowedUpdates = {
      teamName: body.teamName,
      // can add more here if needed
    };

    const ownershipCheckUpdate = await prisma.internProfile.findUnique({ where: { id: cleanId } });
    if (!ownershipCheckUpdate || ownershipCheckUpdate.adminId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Intern does not belong to you" }, { status: 403 });
    }
    const intern = await prisma.internProfile.update({
      where: { id: cleanId },
      data: allowedUpdates,
      include: {
        user: { select: { email: true } },
        dailyReports: true,
      }
    });

    return NextResponse.json(intern);
  } catch (error) {
    console.error("Failed to update intern:", error);
    return NextResponse.json({ error: "Failed to update intern" }, { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { id } = await params;
    const cleanId = id.startsWith("intern-") ? id.replace("intern-", "") : id;

    // Prisma Cascade delete is configured for InternProfile dependencies,
    // but the associated User must also be deleted to fully remove the account
    const intern = await prisma.internProfile.findUnique({ where: { id: cleanId } });
    if (intern && intern.adminId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Intern does not belong to you" }, { status: 403 });
    }

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    // Delete the User (which will cascade and delete the InternProfile as well)
    await prisma.user.delete({
      where: { id: intern.userId }
    });

    return NextResponse.json({ message: "Intern deleted successfully" });
  } catch (error) {
    console.error("Failed to delete intern:", error);
    return NextResponse.json({ error: "Failed to delete intern" }, { status: 500 });
  }
}
