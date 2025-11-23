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

    // Find member with user
    const member = await prisma.member.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      )
    }

    // Update User verification status
    await prisma.user.update({
      where: { id: member.userId },
      data: {
        verificationStatus: "APPROVED",
        verifiedAt: new Date(),
      },
    })

    // Update Member approval tracking
    await prisma.member.update({
      where: { id },
      data: {
        approvedByAdminId: session.user.id,
        approvedAt: new Date(),
      },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        actionType: "APPROVE_MEMBER",
        targetId: member.userId,
        notes: `Approved member ${member.user.nickname}`,
      },
    })

    // Redirect back to members page
    return NextResponse.redirect(new URL("/admin/members", request.url))
  } catch (error) {
    console.error("Error approving member:", error)
    return NextResponse.json(
      { error: "Failed to approve member" },
      { status: 500 }
    )
  }
}
