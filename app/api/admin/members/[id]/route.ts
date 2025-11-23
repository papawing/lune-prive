import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/admin/members/[id] - Get single member
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
            verificationStatus: true,
            verifiedAt: true,
            createdAt: true,
            locale: true,
          },
        },
        photos: {
          orderBy: { displayOrder: "asc" },
        },
      },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error("Error fetching member:", error)
    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/members/[id] - Update member
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const {
      email,
      password,
      nickname,
      age,
      languages,
      location,
      occupation,
      annualIncome,
      incomeCurrency,
      bio,
      interests,
      hobbies,
      tier,
      isPaid,
      isActive,
      verificationNotes,
      idDocumentUrl,
    } = body

    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Update user fields if provided
    const userUpdateData: Record<string, unknown> = {}
    if (email && email !== existingMember.user.email) {
      // Check for duplicate email
      const duplicateEmail = await prisma.user.findUnique({ where: { email } })
      if (duplicateEmail) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        )
      }
      userUpdateData.email = email
    }
    if (nickname !== undefined) userUpdateData.nickname = nickname
    if (password && password.length >= 6) {
      userUpdateData.passwordHash = await bcrypt.hash(password, 10)
    }

    // Update user if there are changes
    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: existingMember.userId },
        data: userUpdateData,
      })
    }

    // Update member fields with proper type validation
    const memberUpdateData: Record<string, unknown> = {}

    // Numeric fields with type conversion
    if (age !== undefined) {
      if (age === "" || age === null) {
        memberUpdateData.age = null
      } else {
        const parsedAge = typeof age === 'string' ? parseInt(age, 10) : age
        memberUpdateData.age = isNaN(parsedAge) ? null : parsedAge
      }
    }

    if (annualIncome !== undefined) {
      if (annualIncome === "" || annualIncome === null) {
        memberUpdateData.annualIncome = null
      } else {
        const parsed = typeof annualIncome === 'string' ? parseInt(annualIncome, 10) : annualIncome
        memberUpdateData.annualIncome = isNaN(parsed) ? null : parsed
      }
    }

    // String fields
    if (languages !== undefined) memberUpdateData.languages = languages
    if (location !== undefined) memberUpdateData.location = location === "" ? null : location
    if (occupation !== undefined) memberUpdateData.occupation = occupation === "" ? null : occupation
    if (incomeCurrency !== undefined) memberUpdateData.incomeCurrency = incomeCurrency || "USD"

    // JSON field with empty check
    if (bio !== undefined) memberUpdateData.bio = bio && Object.keys(bio).length > 0 ? bio : null

    // Arrays
    if (interests !== undefined) memberUpdateData.interests = interests
    if (hobbies !== undefined) memberUpdateData.hobbies = hobbies

    // Enums/Booleans
    if (tier !== undefined) memberUpdateData.tier = tier
    if (isPaid !== undefined) memberUpdateData.isPaid = isPaid
    if (isActive !== undefined) memberUpdateData.isActive = isActive

    // Documents
    if (verificationNotes !== undefined) memberUpdateData.verificationNotes = verificationNotes === "" ? null : verificationNotes
    if (idDocumentUrl !== undefined) memberUpdateData.idDocumentUrl = idDocumentUrl === "" ? null : idDocumentUrl

    // Update member profile
    const updatedMember = await prisma.member.update({
      where: { id },
      data: memberUpdateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
            verificationStatus: true,
            verifiedAt: true,
            createdAt: true,
            locale: true,
          },
        },
        photos: {
          orderBy: { displayOrder: "asc" },
        },
      },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        actionType: "UPDATE_MEMBER",
        targetUserId: existingMember.userId,
        notes: `Updated member profile for ${existingMember.user.nickname}`,
      },
    })

    return NextResponse.json({ success: true, member: updatedMember })
  } catch (error) {
    console.error("Error updating member:", error)
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/members/[id] - Delete member
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get member info before deletion
    const member = await prisma.member.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Delete user (cascade will delete member, photos, bookmarks, meeting requests)
    await prisma.user.delete({
      where: { id: member.userId },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        actionType: "DELETE_MEMBER",
        targetUserId: member.userId,
        notes: `Deleted member ${member.user.nickname} (${member.user.email})`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting member:", error)
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    )
  }
}
