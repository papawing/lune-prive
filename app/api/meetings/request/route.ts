import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "MEMBER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { castId } = await request.json();

    if (!castId) {
      return NextResponse.json(
        { error: "Cast ID is required" },
        { status: 400 }
      );
    }

    // Get member
    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Verify cast exists and is active
    const cast = await prisma.cast.findUnique({
      where: { id: castId },
    });

    if (!cast || !cast.isActive) {
      return NextResponse.json(
        { error: "Cast not found or inactive" },
        { status: 404 }
      );
    }

    // Check tier access
    if (
      member.tier === "BASIC" &&
      cast.tierClassification === "HIGH_CLASS"
    ) {
      return NextResponse.json(
        { error: "Upgrade to Premium to access High-Class members" },
        { status: 403 }
      );
    }

    // Check for existing pending/confirmed requests
    const existingRequest = await prisma.meetingRequest.findFirst({
      where: {
        memberId: member.id,
        castId,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending request with this member" },
        { status: 409 }
      );
    }

    // Create meeting request
    const meetingRequest = await prisma.meetingRequest.create({
      data: {
        memberId: member.id,
        castId,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Meeting request sent successfully",
        meetingRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating meeting request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
