import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/admin/members/[id]/toggle-active - Toggle member active status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get current member
    const member = await prisma.member.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Toggle active status
    const updatedMember = await prisma.member.update({
      where: { id },
      data: { isActive: !member.isActive },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
            verificationStatus: true,
          },
        },
      },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        actionType: updatedMember.isActive
          ? "ACTIVATE_MEMBER"
          : "DEACTIVATE_MEMBER",
        targetUserId: member.userId,
        notes: `${updatedMember.isActive ? "Activated" : "Deactivated"} member ${member.user.nickname}`,
      },
    })

    // Redirect back to members page
    return NextResponse.redirect(new URL("/admin/members", request.url))
  } catch (error) {
    console.error("Error toggling member active status:", error)
    return NextResponse.json(
      { error: "Failed to toggle member active status" },
      { status: 500 }
    )
  }
}
