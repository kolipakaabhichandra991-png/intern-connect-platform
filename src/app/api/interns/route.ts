import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const interns = await prisma.internProfile.findMany({
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
