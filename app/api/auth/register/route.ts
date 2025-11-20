import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type")

    if (contentType?.includes("multipart/form-data")) {
      // Member registration with file uploads
      const formData = await request.formData()
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const nickname = formData.get("nickname") as string
      const idDocument = formData.get("idDocument") as File | null
      const incomeProof = formData.get("incomeProof") as File | null

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        )
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10)

      // Upload files to Vercel Blob (if provided)
      let idDocumentUrl: string | undefined
      let incomeProofUrl: string | undefined

      if (idDocument && process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`id-docs/${Date.now()}-${idDocument.name}`, idDocument, {
          access: "public",
        })
        idDocumentUrl = blob.url
      }

      if (incomeProof && process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`income-proofs/${Date.now()}-${incomeProof.name}`, incomeProof, {
          access: "public",
        })
        incomeProofUrl = blob.url
      }

      // Create user and member
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          nickname,
          role: "MEMBER",
          verificationStatus: "PENDING",
          member: {
            create: {
              tier: "BASIC",
              isPaid: false,
              idDocumentUrl,
              incomeProofUrl,
            },
          },
        },
      })

      return NextResponse.json(
        {
          message: "Registration successful. Please wait for verification.",
          userId: user.id
        },
        { status: 201 }
      )
    } else {
      // Cast registration (JSON)
      const body = await request.json()
      const { email, password, nickname, age, location } = body

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        )
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10)

      // Create user and cast
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          nickname,
          role: "CAST",
          verificationStatus: "PENDING",
          cast: {
            create: {
              age: parseInt(age),
              location,
              languages: ["en"], // default
              interests: [],
              tierClassification: "STANDARD",
              isActive: false, // admin activates
            },
          },
        },
      })

      return NextResponse.json(
        {
          message: "Registration successful. Please wait for admin approval.",
          userId: user.id
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
