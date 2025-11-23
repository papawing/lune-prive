import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET /api/admin/members - List all members
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const members = await prisma.user.findMany({
      where: { role: "MEMBER" },
      include: {
        member: {
          include: {
            photos: {
              orderBy: { displayOrder: "asc" },
              take: 1,
            },
          },
        },
      },
      orderBy: [
        { verificationStatus: "asc" }, // PENDING first
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    )
  }
}

// POST /api/admin/members - Create new member
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      photos,
    } = body

    // Validate required fields
    if (!email || !password || !nickname) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, nickname" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user and member in transaction
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nickname,
        role: "MEMBER",
        verificationStatus: "APPROVED", // Admin-created members are auto-approved
        verifiedAt: new Date(),
        member: {
          create: {
            tier: tier || "STANDARD",
            isPaid: isPaid ?? false,
            isActive: isActive ?? true,
            // Proper null handling - preserve 0 values
            age: age === "" || age === null || age === undefined ? null : age,
            languages: languages || [],
            location: location === "" || location === null || location === undefined ? null : location,
            occupation: occupation === "" || occupation === null || occupation === undefined ? null : occupation,
            annualIncome: annualIncome === "" || annualIncome === null || annualIncome === undefined ? null : annualIncome,
            incomeCurrency: incomeCurrency || "USD",
            bio: bio && Object.keys(bio).length > 0 ? bio : null,
            interests: interests || [],
            hobbies: hobbies || [],
            idDocumentUrl: idDocumentUrl === "" || idDocumentUrl === null || idDocumentUrl === undefined ? null : idDocumentUrl,
            verificationNotes: verificationNotes === "" || verificationNotes === null || verificationNotes === undefined ? null : verificationNotes,
            approvedByAdminId: session.user.id,
            approvedAt: new Date(),
            photos: photos
              ? {
                  create: photos.map((photoUrl: string, index: number) => ({
                    photoUrl,
                    displayOrder: index,
                    isVerified: true, // Admin-uploaded photos are auto-verified
                  })),
                }
              : undefined,
          },
        },
      },
      include: {
        member: {
          include: {
            photos: {
              orderBy: { displayOrder: "asc" },
            },
          },
        },
      },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        actionType: "CREATE_MEMBER",
        targetUserId: user.id,
        notes: `Created member profile for ${nickname} (${email})`,
      },
    })

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error) {
    console.error("Error creating member:", error)
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    )
  }
}
