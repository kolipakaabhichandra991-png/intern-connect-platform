import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { internId, type, rating, comments } = await req.json();

    const review = await prisma.review.create({
      data: {
        internId,
        reviewerId: session.user.id,
        type: type || "FEEDBACK",
        rating: Number(rating),
        comments: comments || ""
      }
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Fetch latest 10 reviews
    const reviews = await prisma.review.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
      include: {
        reviewer: {
          select: {
            email: true,
            role: true,
            internProfile: {
              select: { name: true }
            }
          }
        },
        intern: {
          select: { name: true }
        }
      }
    });

    // Format them for the frontend
    const formattedReviews = reviews.map(r => ({
      id: r.id,
      name: r.reviewer?.internProfile?.name || r.reviewer?.email?.split('@')[0] || "Anonymous",
      targetName: r.intern?.name || "Unknown",
      text: r.comments,
      rating: r.rating,
      timestamp: r.timestamp
    }));

    return NextResponse.json(formattedReviews, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
