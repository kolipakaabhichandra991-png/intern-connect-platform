import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: session.user.email,
          mode: 'insensitive'
        },
        role: (session.user as any).role
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const internProfile = await prisma.internProfile.findUnique({
      where: { userId: user.id },
      include: {
        dailyReports: true,
      }
    });

    if (!internProfile) {
      return NextResponse.json({ error: "Intern profile not found" }, { status: 404 });
    }

    return NextResponse.json(internProfile);
  } catch (error) {
    console.error("Failed to fetch current intern:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: session.user.email,
          mode: 'insensitive'
        },
        role: (session.user as any).role
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const internProfile = await prisma.internProfile.findUnique({
      where: { userId: user.id }
    });

    if (!internProfile) {
      return NextResponse.json({ error: "Intern profile not found" }, { status: 404 });
    }

    const data = await req.json();
    
    const updatedProfile = await prisma.internProfile.update({
      where: { id: internProfile.id },
      data: {
        bio: data.bio !== undefined ? data.bio : internProfile.bio,
        likesCorporate: data.likesCorporate !== undefined ? data.likesCorporate : internProfile.likesCorporate,
        dislikesCorporate: data.dislikesCorporate !== undefined ? data.dislikesCorporate : internProfile.dislikesCorporate,
        instagramId: data.instagramId !== undefined ? data.instagramId : internProfile.instagramId,
        linkedInId: data.linkedInId !== undefined ? data.linkedInId : internProfile.linkedInId,
        githubId: data.githubId !== undefined ? data.githubId : (internProfile as any).githubId,
      }
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Failed to update intern profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
