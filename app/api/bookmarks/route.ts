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

    // Get member ID
    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        memberId_castId: {
          memberId: member.id,
          castId,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Bookmark already exists" },
        { status: 409 }
      );
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        memberId: member.id,
        castId,
      },
    });

    return NextResponse.json(
      { success: true, bookmark },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "MEMBER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const castId = searchParams.get("castId");

    if (!castId) {
      return NextResponse.json(
        { error: "Cast ID is required" },
        { status: 400 }
      );
    }

    // Get member ID
    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Delete bookmark
    await prisma.bookmark.delete({
      where: {
        memberId_castId: {
          memberId: member.id,
          castId,
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
