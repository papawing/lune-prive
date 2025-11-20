"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import FilterPanel, { type FilterState } from "./FilterPanel"
import CastCard from "@/components/cast/CastCard"

interface Cast {
  id: string
  age: number
  languages: string[]
  location: string
  interests: string[]
  tierClassification: "STANDARD" | "HIGH_CLASS"
  isFeatured: boolean
  user: {
    id: string
    nickname: string
    verificationStatus: "PENDING" | "APPROVED" | "REJECTED"
  }
  photos: Array<{ photoUrl: string }>
  bookmarks: Array<{ id: string }>
}

interface BrowseClientProps {
  initialCasts: Cast[]
  locale: string
}

export default function BrowseClient({ initialCasts, locale }: BrowseClientProps) {
  const t = useTranslations()
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 35],
    languages: [],
    location: "",
    interests: [],
  })

  // Extract unique locations and interests from all casts
  const availableLocations = useMemo(() => {
    const locations = new Set<string>()
    initialCasts.forEach((cast) => {
      if (cast.location) locations.add(cast.location)
    })
    return Array.from(locations).sort()
  }, [initialCasts])

  const availableInterests = useMemo(() => {
    const interests = new Set<string>()
    initialCasts.forEach((cast) => {
      cast.interests.forEach((interest) => interests.add(interest))
    })
    return Array.from(interests).sort()
  }, [initialCasts])

  // Filter casts based on current filters
  const filteredCasts = useMemo(() => {
    return initialCasts.filter((cast) => {
      // Age filter
      if (cast.age < filters.ageRange[0] || cast.age > filters.ageRange[1]) {
        return false
      }

      // Language filter
      if (filters.languages.length > 0) {
        const hasMatchingLanguage = filters.languages.some((lang) =>
          cast.languages.includes(lang)
        )
        if (!hasMatchingLanguage) return false
      }

      // Location filter
      if (filters.location && cast.location !== filters.location) {
        return false
      }

      // Interests filter
      if (filters.interests.length > 0) {
        const hasMatchingInterest = filters.interests.some((interest) =>
          cast.interests.includes(interest)
        )
        if (!hasMatchingInterest) return false
      }

      return true
    })
  }, [initialCasts, filters])

  // Separate featured and regular casts
  const featuredCasts = filteredCasts.filter((cast) => cast.isFeatured)
  const regularCasts = filteredCasts.filter((cast) => !cast.isFeatured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filter Panel */}
      <FilterPanel
        onFilterChange={setFilters}
        availableLocations={availableLocations}
        availableInterests={availableInterests}
      />

      {/* Featured Casts Section - Airbnb Horizontal Scroll */}
      {featuredCasts.length > 0 && (
        <section className="mb-16">
          <h2 className="font-semibold text-xl md:text-2xl text-deep mb-6">
            ⭐ {t("browse.featuredTitle")}
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
            {featuredCasts.map((cast) => (
              <div
                key={cast.id}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
              >
                <CastCard
                  id={cast.id}
                  name={cast.user.nickname}
                  age={cast.age}
                  languages={cast.languages}
                  tierClassification={cast.tierClassification}
                  verificationStatus={cast.user.verificationStatus}
                  isFeatured={cast.isFeatured}
                  photoUrl={cast.photos[0]?.photoUrl}
                  isBookmarked={cast.bookmarks.length > 0}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Casts Grid - Airbnb Style */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-xl md:text-2xl text-deep">
            {t("browse.allCasts")}
          </h2>
          <p className="text-sm text-light">
            {regularCasts.length} {regularCasts.length === 1 ? "cast" : "casts"}
          </p>
        </div>

        {regularCasts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-light mb-2">
              {t("browse.noCasts")}
            </p>
            <p className="text-sm text-light">
              {t("browse.tryDifferentFilters") || "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {regularCasts.map((cast) => (
              <CastCard
                key={cast.id}
                id={cast.id}
                name={cast.user.nickname}
                age={cast.age}
                languages={cast.languages}
                tierClassification={cast.tierClassification}
                verificationStatus={cast.user.verificationStatus}
                isFeatured={cast.isFeatured}
                photoUrl={cast.photos[0]?.photoUrl}
                isBookmarked={cast.bookmarks.length > 0}
                locale={locale}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
