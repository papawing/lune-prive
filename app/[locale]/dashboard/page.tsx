import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardRedirectPage({ params }: PageProps) {
  const { locale } = await params
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect(`/${locale}/login`)
    return
  }

  // Role-based dashboard routing
  switch (session.user.role) {
    case "ADMIN":
      redirect(`/${locale}/admin/dashboard`)
      break
    case "CAST":
      redirect(`/${locale}/cast/dashboard`)
      break
    case "MEMBER":
      redirect(`/${locale}/browse`)
      break
    default:
      redirect(`/${locale}`)
      break
  }
}
