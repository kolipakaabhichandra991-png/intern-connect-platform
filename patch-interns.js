const fs = require('fs');

const routeTs = `export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let targetAdminId = null;

    if (session.user.role === "ADMIN") {
      targetAdminId = session.user.id;
    } else {
      // Find the intern's adminId
      const intern = await prisma.internProfile.findUnique({
        where: { userId: session.user.id }
      });
      if (!intern) {
        return NextResponse.json({ error: "Intern profile not found" }, { status: 404 });
      }
      targetAdminId = intern.adminId;
    }

    const interns = await prisma.internProfile.findMany({
      where: {
        adminId: targetAdminId
      },
      include: {
        user: {
          select: {
            email: true
          }
        },
        project: true // Include project data so they can see team members properly
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
`;

fs.writeFileSync('src/app/api/interns/route.ts', routeTs, 'utf8');
console.log("Patched interns route!");
