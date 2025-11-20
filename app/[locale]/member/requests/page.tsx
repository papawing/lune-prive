import { Link } from "@/i18n/routing"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MemberRequestsPage({ params }: PageProps) {
  const { locale } = await params
  const session = await auth()
  const t = await getTranslations()

  // Protect member route
  if (!session || session.user.role !== "MEMBER") {
    redirect(`/${locale}/login`)
  }

  // Get member profile
  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  })

  if (!member) {
    redirect(`/${locale}/login`)
  }

  // Fetch all meeting requests for this member
  const [pendingRequests, confirmedRequests, completedRequests, cancelledRequests] = await Promise.all([
    prisma.meetingRequest.findMany({
      where: {
        memberId: member.id,
        status: "PENDING",
      },
      include: {
        cast: {
          include: {
            user: true,
            photos: {
              take: 1,
              orderBy: { displayOrder: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.meetingRequest.findMany({
      where: {
        memberId: member.id,
        status: "CONFIRMED",
      },
      include: {
        cast: {
          include: {
            user: true,
            photos: {
              take: 1,
              orderBy: { displayOrder: "asc" },
            },
          },
        },
      },
      orderBy: { scheduledDate: "asc" },
    }),
    prisma.meetingRequest.findMany({
      where: {
        memberId: member.id,
        status: "COMPLETED",
      },
      include: {
        cast: {
          include: {
            user: true,
            photos: {
              take: 1,
              orderBy: { displayOrder: "asc" },
            },
          },
        },
      },
      orderBy: { scheduledDate: "desc" },
    }),
    prisma.meetingRequest.findMany({
      where: {
        memberId: member.id,
        status: "CANCELLED",
      },
      include: {
        cast: {
          include: {
            user: true,
            photos: {
              take: 1,
              orderBy: { displayOrder: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-deep">
                My Meeting Requests
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Track your meeting requests and scheduled meetings
              </p>
            </div>
            <Link
              href="/browse"
              locale={locale}
              className="px-4 py-2 bg-gradient-rausch text-white font-semibold rounded-lg hover:scale-[1.02] transition-transform shadow-md"
            >
              Browse Casts
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-deep">{pendingRequests.length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-teal-600">{confirmedRequests.length}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{completedRequests.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-400">{cancelledRequests.length}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-deep mb-4">⏳ Pending Requests</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Cast Photo */}
                      <Link href={`/browse/${request.cast.id}`} locale={locale}>
                        <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 hover:opacity-90 transition-opacity">
                          {request.cast.photos[0] ? (
                            <img
                              src={request.cast.photos[0].url}
                              alt={request.cast.user.name || "Cast"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-2xl">👤</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Request Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/browse/${request.cast.id}`}
                              locale={locale}
                              className="text-lg font-semibold text-deep hover:text-rausch transition-colors"
                            >
                              {request.cast.user.name}
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">
                              Requested on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                          ⏳ Waiting for admin to coordinate the meeting details. You'll be notified once it's confirmed.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Confirmed Meetings */}
        {confirmedRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-deep mb-4">✅ Confirmed Meetings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {confirmedRequests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Cast Photo */}
                      <Link href={`/browse/${request.cast.id}`} locale={locale}>
                        <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 hover:opacity-90 transition-opacity">
                          {request.cast.photos[0] ? (
                            <img
                              src={request.cast.photos[0].url}
                              alt={request.cast.user.name || "Cast"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-2xl">👤</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Meeting Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/browse/${request.cast.id}`}
                              locale={locale}
                              className="text-lg font-semibold text-deep hover:text-rausch transition-colors"
                            >
                              {request.cast.user.name}
                            </Link>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-900">
                                📅 <span className="font-semibold">Date:</span>{" "}
                                {request.scheduledDate
                                  ? new Date(request.scheduledDate).toLocaleString()
                                  : "TBD"}
                              </p>
                              <p className="text-sm text-gray-900">
                                📍 <span className="font-semibold">Location:</span>{" "}
                                {request.luneLocation || "TBD"}
                              </p>
                              {request.adminNotes && (
                                <p className="text-sm text-gray-600 mt-2">
                                  💬 <span className="font-semibold">Admin notes:</span>{" "}
                                  {request.adminNotes}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full">
                            Confirmed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Past Meetings */}
        {completedRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-deep mb-4">📜 Past Meetings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {completedRequests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors opacity-75">
                    <div className="flex items-start gap-4">
                      <Link href={`/browse/${request.cast.id}`} locale={locale}>
                        <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 hover:opacity-90 transition-opacity">
                          {request.cast.photos[0] ? (
                            <img
                              src={request.cast.photos[0].url}
                              alt={request.cast.user.name || "Cast"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-2xl">👤</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/browse/${request.cast.id}`}
                              locale={locale}
                              className="text-lg font-semibold text-deep hover:text-rausch transition-colors"
                            >
                              {request.cast.user.name}
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">
                              Completed on{" "}
                              {request.scheduledDate
                                ? new Date(request.scheduledDate).toLocaleDateString()
                                : "Unknown date"}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingRequests.length === 0 &&
          confirmedRequests.length === 0 &&
          completedRequests.length === 0 &&
          cancelledRequests.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-deep mb-2">No Meeting Requests Yet</h3>
              <p className="text-gray-600 mb-6">
                Browse casts and request your first meeting
              </p>
              <Link
                href="/browse"
                locale={locale}
                className="inline-block px-6 py-3 bg-gradient-rausch text-white font-semibold rounded-lg hover:scale-[1.02] transition-transform shadow-md"
              >
                Browse Casts
              </Link>
            </div>
          )}
      </div>
    </div>
  )
}
