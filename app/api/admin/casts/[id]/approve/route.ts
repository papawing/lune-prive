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

    // Update cast verification status and activate
    await prisma.user.update({
      where: { id },
      data: {
        verificationStatus: "APPROVED",
        cast: {
          update: {
            isActive: true,
          },
        },
      },
    })

    // Redirect back to casts page
    return NextResponse.redirect(new URL("/admin/casts", request.url))
  } catch (error) {
    console.error("Error approving cast:", error)
    return NextResponse.json(
      { error: "Failed to approve cast" },
      { status: 500 }
    )
  }
}
