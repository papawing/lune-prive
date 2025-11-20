import { Role, VerificationStatus } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      verificationStatus: string
    } & DefaultSession["user"]
  }

  interface User {
    role: Role
    verificationStatus: VerificationStatus
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    verificationStatus: VerificationStatus
  }
}
