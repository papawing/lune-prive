import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    // Verify admin authorization
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Update meeting request status to completed
    await prisma.meetingRequest.update({
      where: { id },
      data: {
        status: "COMPLETED",
      },
    })

    // Redirect back to requests page
    return NextResponse.redirect(new URL("/admin/meeting-requests", request.url))
  } catch (error) {
    console.error("Error completing meeting request:", error)
    return NextResponse.json(
      { error: "Failed to complete meeting request" },
      { status: 500 }
    )
  }
}
