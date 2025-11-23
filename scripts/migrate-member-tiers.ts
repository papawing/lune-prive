import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting member tier migration...")

  // Update BASIC → STANDARD
  const basicCount = await prisma.member.updateMany({
    where: { tier: "BASIC" as any },
    data: { tier: "STANDARD" as any },
  })
  console.log(`✓ Migrated ${basicCount.count} BASIC members to STANDARD`)

  // Update PREMIUM → GOLD
  const premiumCount = await prisma.member.updateMany({
    where: { tier: "PREMIUM" as any },
    data: { tier: "GOLD" as any },
  })
  console.log(`✓ Migrated ${premiumCount.count} PREMIUM members to GOLD`)

  console.log("Migration complete!")
}

main()
  .catch((e) => {
    console.error("Migration failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
