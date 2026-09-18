import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Create Admin
    const admin = await prisma.user.upsert({
      where: { email: "admin@belvo.com" },
      update: {},
      create: {
        id: crypto.randomUUID(),
        email: "admin@belvo.com",
        
        role: "ADMIN"
      }
    });

    // 2. Create Intern User
    const internUser = await prisma.user.upsert({
      where: { email: "intern@belvo.com" },
      update: {},
      create: {
        id: crypto.randomUUID(),
        email: "intern@belvo.com",
        
        role: "INTERN"
      }
    });

    // 3. Create Intern Profile
    const internProfile = await prisma.internProfile.upsert({
      where: { userId: internUser.id },
      update: {},
      create: {
        userId: internUser.id,
        name: "Alex Fielding",
        dob: new Date("2003-05-15"),
        designation: "Software Engineering Intern",
        department: "Engineering",
        teamName: "Nexus WebGL Core",
        xp: 330,
        photoUrl: "https://i.pravatar.cc/300?img=12",
        idCardNumber: "BEL-" + Math.floor(Math.random() * 10000).toString(),
        age: 21,
        gender: "Male",
        bloodGroup: "O+",
        city: "San Francisco",
        bio: "Passionate about WebGL and interactive 3D experiences. Studying Computer Science.",
        likesCorporate: "Great mentorship and free coffee!",
        completedProjects: JSON.stringify(["Internkonnect Dashboard", "GraphQL API Migration"]),
        ongoingProjects: JSON.stringify([])
      }
    });

    // 4. Create Sarah's mock intern profile (no auth user just for directory)
    const sarahUser = await prisma.user.upsert({
      where: { email: "sarah@belvo.com" },
      update: {},
      create: {
        id: crypto.randomUUID(),
        email: "sarah@belvo.com",
        
        role: "INTERN"
      }
    });

    await prisma.internProfile.upsert({
      where: { userId: sarahUser.id },
      update: {},
      create: {
        userId: sarahUser.id,
        name: "Sarah Jenkins",
        dob: new Date("2002-08-20"),
        designation: "Design Intern",
        department: "Design",
        teamName: "Brand Identity",
        xp: 150,
        photoUrl: "https://i.pravatar.cc/300?img=5",
        idCardNumber: "BEL-" + Math.floor(Math.random() * 10000).toString(),
        bio: "UI/UX enthusiast.",
      }
    });

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seed error", error);
    return NextResponse.json({ success: false, error: "Failed to seed" }, { status: 500 });
  }
}
