import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/admin/members/[id]/upgrade - Upgrade member tier
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

    // Determine next tier
    let newTier: "STANDARD" | "GOLD" | "VIP"
    if (member.tier === "STANDARD") {
      newTier = "GOLD"
    } else if (member.tier === "GOLD") {
      newTier = "VIP"
    } else {
      return NextResponse.json(
        { error: "Member is already at highest tier (VIP)" },
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
        actionType: "UPGRADE_MEMBER_TIER",
        targetUserId: member.userId,
        notes: `Upgraded ${member.user.nickname} from ${member.tier} to ${newTier}`,
      },
    })

    return NextResponse.redirect(new URL("/admin/members", request.url))
  } catch (error) {
    console.error("Error upgrading member tier:", error)
    return NextResponse.json(
      { error: "Failed to upgrade tier" },
      { status: 500 }
    )
  }
}
