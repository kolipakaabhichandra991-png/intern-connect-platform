import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const interns = await prisma.internProfile.findMany({
      where: {
        adminId: session.user.id
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(interns);
  } catch (error) {
    console.error("Failed to fetch interns:", error);
    return NextResponse.json({ error: "Failed to fetch interns" }, { status: 500 });
  }
}
