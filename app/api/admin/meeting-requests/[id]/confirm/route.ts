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
    const formData = await request.formData()
    const scheduledDate = formData.get("scheduledDate") as string
    const luneLocation = formData.get("luneLocation") as string
    const adminNotes = formData.get("adminNotes") as string | null

    // Update meeting request with coordination details
    await prisma.meetingRequest.update({
      where: { id },
      data: {
        status: "CONFIRMED",
        scheduledDate: new Date(scheduledDate),
        luneLocation,
        adminNotes: adminNotes || null,
      },
    })

    // Redirect back to requests page
    return NextResponse.redirect(new URL("/admin/meeting-requests", request.url))
  } catch (error) {
    console.error("Error confirming meeting request:", error)
    return NextResponse.json(
      { error: "Failed to confirm meeting request" },
      { status: 500 }
    )
  }
}
