import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, department, photoUrl } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if user exists (case-insensitive)
    const existing = await prisma.user.findFirst({
      where: { 
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Create User (In production, hash password!)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: password, // TODO: bcrypt
        role: role || "INTERN"
      }
    });

    if (user.role === "INTERN") {
      // Create Intern Profile
      await prisma.internProfile.create({
        data: {
          userId: user.id,
          name,
          dob: new Date("2000-01-01"), // Default dob for now
          designation: "New Intern",
          department: department || "Engineering",
          photoUrl: photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          idCardNumber: "BEL-" + Math.floor(Math.random() * 10000).toString(),
        }
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
