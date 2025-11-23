import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string; photoId: string }>
}

// PATCH /api/admin/members/[id]/photos/[photoId] - Update photo (verify)
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { photoId } = await params
    const { isVerified } = await request.json()

    if (isVerified === undefined) {
      return NextResponse.json(
        { error: "isVerified field required" },
        { status: 400 }
      )
    }

    const photo = await prisma.memberPhoto.update({
      where: { id: photoId },
      data: { isVerified },
    })

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error("Error updating member photo:", error)
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/members/[id]/photos/[photoId] - Delete photo
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { photoId } = await params

    await prisma.memberPhoto.delete({
      where: { id: photoId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting member photo:", error)
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    )
  }
}
