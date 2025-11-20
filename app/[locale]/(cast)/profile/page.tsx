import { redirect } from "@/i18n/routing"
import { auth } from "@/lib/auth"
import { getTranslations } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CastProfilePage({ params }: PageProps) {
  await params; // Await params in Next.js 15+
  const session = await auth()
  const t = await getTranslations()

  // Protect cast route
  if (!session || session.user.role !== "CAST") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌙</span>
              <span className="font-display text-xl font-bold text-deep">
                {t("common.appName")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user.nickname || session.user.email}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF385C] to-[#E61E4D] flex items-center justify-center text-white font-semibold">
                {session.user.nickname?.[0] || 'C'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep mb-2">
            {t("cast.profile") || "Your Profile"}
          </h1>
          <p className="text-gray-600">
            Welcome back, {session.user.nickname || "Cast"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Views */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Profile Views</h3>
              <span className="text-2xl">👁️</span>
            </div>
            <p className="text-3xl font-bold text-deep">0</p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>

          {/* Bookmarks */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Bookmarks</h3>
              <span className="text-2xl">❤️</span>
            </div>
            <p className="text-3xl font-bold text-deep">0</p>
            <p className="text-xs text-gray-500 mt-2">Members interested</p>
          </div>

          {/* Meeting Requests */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Requests</h3>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-deep">0</p>
            <p className="text-xs text-gray-500 mt-2">Pending meetings</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-deep mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/cast/edit-profile"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF385C] hover:bg-gray-50 transition-all text-center"
            >
              <div className="text-2xl mb-2">✏️</div>
              <div className="text-sm font-semibold text-deep">Edit Profile</div>
            </a>
            <a
              href="/cast/photos"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF385C] hover:bg-gray-50 transition-all text-center"
            >
              <div className="text-2xl mb-2">📸</div>
              <div className="text-sm font-semibold text-deep">Manage Photos</div>
            </a>
            <a
              href="/cast/requests"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF385C] hover:bg-gray-50 transition-all text-center"
            >
              <div className="text-2xl mb-2">📬</div>
              <div className="text-sm font-semibold text-deep">View Requests</div>
            </a>
          </div>
        </div>

        {/* Development Note */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-sm text-blue-700">
            <strong>🚧 Cast Dashboard - Under Development</strong>
            <br />
            This is a placeholder page. Full cast features (profile management, photo uploads, request handling) will be built in Week 3.
          </p>
        </div>
      </main>
    </div>
  )
}
