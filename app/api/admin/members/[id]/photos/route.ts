import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/admin/members/[id]/photos - Add photos via URLs
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { photos } = await request.json()

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { error: "Photos array required" },
        { status: 400 }
      )
    }

    // Verify member exists
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: { displayOrder: "desc" },
          take: 1,
        },
      },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Get starting order
    const startOrder = member.photos[0] ? member.photos[0].displayOrder + 1 : 0

    // Create photos
    const createdPhotos = await Promise.all(
      photos.map((photoUrl: string, index: number) =>
        prisma.memberPhoto.create({
          data: {
            memberId: id,
            photoUrl,
            displayOrder: startOrder + index,
            isVerified: true, // Auto-verify admin-added photos
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      photos: createdPhotos,
      count: createdPhotos.length,
    })
  } catch (error) {
    console.error("Error adding member photos:", error)
    return NextResponse.json(
      { error: "Failed to add photos" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/members/[id]/photos - Reorder photos
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { photoOrders } = await request.json()

    if (!photoOrders || !Array.isArray(photoOrders)) {
      return NextResponse.json(
        { error: "photoOrders array required" },
        { status: 400 }
      )
    }

    // Update display order for each photo
    await Promise.all(
      photoOrders.map(
        ({ photoId, displayOrder }: { photoId: string; displayOrder: number }) =>
          prisma.memberPhoto.update({
            where: { id: photoId },
            data: { displayOrder },
          })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reordering member photos:", error)
    return NextResponse.json(
      { error: "Failed to reorder photos" },
      { status: 500 }
    )
  }
}
