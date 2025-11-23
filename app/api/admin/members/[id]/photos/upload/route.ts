import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/admin/members/[id]/photos/upload - Upload photo
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

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

    // Get file from request
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 5MB" },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const blob = await put(`members/${id}/${Date.now()}-${filename}`, file, {
      access: "public",
    })

    // Get next display order
    const nextOrder = member.photos[0] ? member.photos[0].displayOrder + 1 : 0

    // Create photo record
    const photo = await prisma.memberPhoto.create({
      data: {
        memberId: id,
        photoUrl: blob.url,
        displayOrder: nextOrder,
        isVerified: false, // Admin needs to verify
      },
    })

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error("Error uploading member photo:", error)
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    )
  }
}
