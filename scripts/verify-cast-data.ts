/**
 * Diagnostic Script: Verify Cast Data Structure
 *
 * Purpose: Verify that Cast users have proper IDs and data structure
 *
 * Run with: npx tsx scripts/verify-cast-data.ts
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function verifyCastData() {
  console.log("🔍 Verifying Cast data structure...\n")

  try {
    // Find all users with role="CAST" (same query as admin page)
    const casts = await prisma.user.findMany({
      where: { role: "CAST" },
      include: {
        cast: {
          include: {
            photos: {
              take: 1,
              orderBy: { displayOrder: "asc" },
            },
          },
        },
      },
      orderBy: [
        { verificationStatus: "asc" },
        { createdAt: "desc" },
      ],
    })

    console.log(`📊 Found ${casts.length} Cast user(s)\n`)

    if (casts.length === 0) {
      console.log("⚠️  No Cast users found in database")
      return
    }

    casts.forEach((user, index) => {
      console.log(`\n${index + 1}. Cast User Details:`)
      console.log(`   User ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Nickname: ${user.nickname}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Verification Status: ${user.verificationStatus}`)

      if (user.cast) {
        console.log(`   ✅ Cast Profile EXISTS`)
        console.log(`      Cast ID: ${user.cast.id}`)
        console.log(`      Cast User ID (FK): ${user.cast.userId}`)
        console.log(`      Age: ${user.cast.age}`)
        console.log(`      Location: ${user.cast.location}`)
        console.log(`      Tier: ${user.cast.tierClassification}`)
        console.log(`      Active: ${user.cast.isActive}`)
        console.log(`      Featured: ${user.cast.isFeatured}`)
        console.log(`      Photos: ${user.cast.photos.length}`)

        // Test the View Profile link URL
        const viewProfileUrl = `/browse/${user.cast.id}`
        console.log(`      🔗 View Profile URL would be: ${viewProfileUrl}`)

        // Verify the Cast ID is valid
        if (!user.cast.id || user.cast.id === "undefined") {
          console.log(`      ❌ ERROR: Cast ID is invalid!`)
        } else {
          console.log(`      ✅ Cast ID is valid`)
        }
      } else {
        console.log(`   ❌ Cast Profile MISSING`)
      }
    })

    console.log("\n" + "=".repeat(60))
    console.log("📝 Summary:")
    console.log("=".repeat(60))

    const withProfile = casts.filter((u) => u.cast)
    const withoutProfile = casts.filter((u) => !u.cast)
    const withInvalidId = casts.filter((u) => !u.cast?.id || u.cast.id === "undefined")

    console.log(`Total Cast users: ${casts.length}`)
    console.log(`With Cast profile: ${withProfile.length}`)
    console.log(`Without Cast profile: ${withoutProfile.length}`)
    console.log(`With invalid Cast ID: ${withInvalidId.length}`)

    if (withInvalidId.length > 0) {
      console.log("\n❌ Action Required: Some Cast users have invalid IDs")
    } else if (withoutProfile.length > 0) {
      console.log("\n⚠️  Action Required: Some Cast users are missing profiles")
    } else {
      console.log("\n✅ All Cast users have valid profiles and IDs!")
    }
  } catch (error) {
    console.error("❌ Error verifying cast data:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the verification
verifyCastData()
  .then(() => {
    console.log("\n✅ Verification complete")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
