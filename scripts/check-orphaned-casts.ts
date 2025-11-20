/**
 * Diagnostic Script: Check for Orphaned Cast Users
 *
 * Purpose: Find Users with role="CAST" that don't have corresponding Cast records
 *
 * Run with: npx tsx scripts/check-orphaned-casts.ts
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkOrphanedCasts() {
  console.log("🔍 Checking for orphaned Cast users...\n")

  try {
    // Find all users with role="CAST"
    const castUsers = await prisma.user.findMany({
      where: { role: "CAST" },
      include: {
        cast: true,
      },
    })

    console.log(`📊 Total users with role="CAST": ${castUsers.length}`)

    // Filter orphaned users (no Cast profile)
    const orphaned = castUsers.filter((user) => !user.cast)

    if (orphaned.length === 0) {
      console.log("✅ No orphaned Cast users found! All Cast users have profiles.")
      return { success: true, orphaned: [] }
    }

    console.log(`\n⚠️  Found ${orphaned.length} orphaned Cast user(s):\n`)

    orphaned.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Nickname: ${user.nickname}`)
      console.log(`   Verification Status: ${user.verificationStatus}`)
      console.log(`   Created: ${user.createdAt}`)
      console.log(`   ❌ Missing Cast profile\n`)
    })

    return { success: false, orphaned }
  } catch (error) {
    console.error("❌ Error checking orphaned casts:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check
checkOrphanedCasts()
  .then((result) => {
    if (result.success) {
      process.exit(0)
    } else {
      console.log("💡 Recommendation: Run the cleanup script to fix orphaned users")
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
