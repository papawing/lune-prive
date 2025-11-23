import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/admin/members/[id]/toggle-payment - Toggle isPaid status
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const member = await prisma.member.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Toggle isPaid
    const updatedMember = await prisma.member.update({
      where: { id },
      data: { isPaid: !member.isPaid },
      include: { user: true },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        actionType: "TOGGLE_MEMBER_PAYMENT",
        targetUserId: member.userId,
        notes: `Set isPaid to ${!member.isPaid} for ${member.user.nickname}`,
      },
    })

    return NextResponse.redirect(new URL("/admin/members", request.url))
  } catch (error) {
    console.error("Error toggling member payment:", error)
    return NextResponse.json(
      { error: "Failed to toggle payment status" },
      { status: 500 }
    )
  }
}
