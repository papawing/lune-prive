import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/admin/members/[id]/downgrade - Downgrade member tier
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

    // Determine previous tier
    let newTier: "STANDARD" | "GOLD" | "VIP"
    if (member.tier === "VIP") {
      newTier = "GOLD"
    } else if (member.tier === "GOLD") {
      newTier = "STANDARD"
    } else {
      return NextResponse.json(
        { error: "Member is already at lowest tier (STANDARD)" },
        { status: 400 }
      )
    }

    // Update tier
    const updatedMember = await prisma.member.update({
      where: { id },
      data: { tier: newTier },
      include: { user: true },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        actionType: "DOWNGRADE_MEMBER_TIER",
        targetUserId: member.userId,
        notes: `Downgraded ${member.user.nickname} from ${member.tier} to ${newTier}`,
      },
    })

    return NextResponse.redirect(new URL("/admin/members", request.url))
  } catch (error) {
    console.error("Error downgrading member tier:", error)
    return NextResponse.json(
      { error: "Failed to downgrade tier" },
      { status: 500 }
    )
  }
}
