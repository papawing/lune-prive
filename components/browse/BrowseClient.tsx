"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"
import { type FilterState } from "./FilterPanel"
import FilterButton from "./FilterButton"
import FilterContent from "./FilterContent"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import CastCard from "@/components/cast/CastCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

type SortOption = "featured" | "newest" | "youngest" | "oldest"

export default function BrowseClient({ initialCasts, locale }: BrowseClientProps) {
  const t = useTranslations()

  // Bottom sheet state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState("")

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>("featured")

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 35],
    languages: [],
    location: "",
    interests: [],
  })

  // Check if any filters are active
  const hasActiveFilters =
    filters.languages.length > 0 ||
    filters.location !== "" ||
    filters.interests.length > 0 ||
    filters.ageRange[0] !== 18 ||
    filters.ageRange[1] !== 35

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

  // Filter and sort casts
  const filteredAndSortedCasts = useMemo(() => {
    let results = initialCasts

    // Search filter (by name)
    if (searchQuery.trim()) {
      results = results.filter((cast) =>
        cast.user.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Age filter
    results = results.filter((cast) => {
      return cast.age >= filters.ageRange[0] && cast.age <= filters.ageRange[1]
    })

    // Language filter
    if (filters.languages.length > 0) {
      results = results.filter((cast) => {
        return filters.languages.some((lang) => cast.languages.includes(lang))
      })
    }

    // Location filter
    if (filters.location) {
      results = results.filter((cast) => cast.location === filters.location)
    }

    // Interests filter
    if (filters.interests.length > 0) {
      results = results.filter((cast) => {
        return filters.interests.some((interest) => cast.interests.includes(interest))
      })
    }

    // Sort results
    const sorted = [...results]
    switch (sortBy) {
      case "featured":
        sorted.sort((a, b) => {
          if (a.isFeatured === b.isFeatured) return 0
          return a.isFeatured ? -1 : 1
        })
        break
      case "youngest":
        sorted.sort((a, b) => a.age - b.age)
        break
      case "oldest":
        sorted.sort((a, b) => b.age - a.age)
        break
      // "newest" would require createdAt field from database
      default:
        break
    }

    return sorted
  }, [initialCasts, searchQuery, filters, sortBy])

  // Separate featured and regular casts (only show featured section if no filters active)
  const featuredCasts = !hasActiveFilters && !searchQuery
    ? filteredAndSortedCasts.filter((cast) => cast.isFeatured)
    : []
  // "All Companions" should show ALL casts (including featured ones)
  const regularCasts = filteredAndSortedCasts

  // Clear all filters function
  const handleClearAllFilters = () => {
    setFilters({
      ageRange: [18, 35],
      languages: [],
      location: "",
      interests: [],
    })
    setSearchQuery("")
  }

  // Remove individual filter
  const removeLanguageFilter = (lang: string) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }))
  }

  const removeInterestFilter = (interest: string) => {
    setFilters((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }))
  }

  // Count active filters
  const activeFilterCount =
    filters.languages.length +
    filters.interests.length +
    (filters.location ? 1 : 0) +
    (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 35 ? 1 : 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* Active Filter Chips - Show only when filters/search active */}
      {(hasActiveFilters || searchQuery) && (
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-light">
              {t("browse.activeFilters")}:
            </span>

            {searchQuery && (
              <Badge
                variant="secondary"
                className="bg-teal/10 text-teal border-teal/20 pl-3 pr-2 py-1 flex items-center gap-1"
              >
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:bg-teal/20 rounded-full p-0.5"
                >
                  ✕
                </button>
              </Badge>
            )}

            {filters.languages.map((lang) => (
              <Badge
                key={lang}
                variant="secondary"
                className="bg-teal/10 text-teal border-teal/20 pl-3 pr-2 py-1 flex items-center gap-1"
              >
                {lang === "en" ? "English" : lang === "zh" ? "中文" : "日本語"}
                <button
                  onClick={() => removeLanguageFilter(lang)}
                  className="ml-1 hover:bg-teal/20 rounded-full p-0.5"
                >
                  ✕
                </button>
              </Badge>
            ))}

            {filters.location && (
              <Badge
                variant="secondary"
                className="bg-teal/10 text-teal border-teal/20 pl-3 pr-2 py-1 flex items-center gap-1"
              >
                📍 {filters.location}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, location: "" }))}
                  className="ml-1 hover:bg-teal/20 rounded-full p-0.5"
                >
                  ✕
                </button>
              </Badge>
            )}

            {filters.interests.map((interest) => (
              <Badge
                key={interest}
                variant="secondary"
                className="bg-teal/10 text-teal border-teal/20 pl-3 pr-2 py-1 flex items-center gap-1"
              >
                {interest}
                <button
                  onClick={() => removeInterestFilter(interest)}
                  className="ml-1 hover:bg-teal/20 rounded-full p-0.5"
                >
                  ✕
                </button>
              </Badge>
            ))}

            {(filters.ageRange[0] !== 18 || filters.ageRange[1] !== 35) && (
              <Badge
                variant="secondary"
                className="bg-teal/10 text-teal border-teal/20 pl-3 pr-2 py-1 flex items-center gap-1"
              >
                Age: {filters.ageRange[0]}-{filters.ageRange[1]}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, ageRange: [18, 35] }))}
                  className="ml-1 hover:bg-teal/20 rounded-full p-0.5"
                >
                  ✕
                </button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAllFilters}
              className="text-xs text-teal hover:text-teal hover:bg-teal/10"
            >
              {t("browse.clearAllFilters")}
            </Button>
          </div>
        </div>
      )}

      {/* Featured Casts Section - Only show if no filters active */}
      {featuredCasts.length > 0 && (
        <section className="mb-8 md:mb-10">
          <h2 className="font-semibold text-xl md:text-2xl text-deep mb-4">
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
                  location={cast.location}
                  interests={cast.interests}
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

      {/* All Casts Grid - OPTIMIZED TO 3 COLS MAX */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-xl md:text-2xl text-deep">
            {hasActiveFilters || searchQuery ? t("browse.title") : t("browse.allCasts")}
          </h2>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-teal focus:ring-0 transition-colors text-sm font-medium"
          >
            <option value="featured">{t("browse.sortFeatured")}</option>
            <option value="youngest">{t("browse.sortYoungest")}</option>
            <option value="oldest">{t("browse.sortOldest")}</option>
          </select>
        </div>

        {regularCasts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-light mb-2">
              {t("browse.noCasts")}
            </p>
            <p className="text-sm text-light mb-6">
              {t("browse.tryDifferentFilters")}
            </p>
            {(hasActiveFilters || searchQuery) && (
              <Button variant="airbnb" onClick={handleClearAllFilters}>
                {t("browse.clearAllFilters")}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {regularCasts.map((cast) => (
              <CastCard
                key={cast.id}
                id={cast.id}
                name={cast.user.nickname}
                age={cast.age}
                languages={cast.languages}
                location={cast.location}
                interests={cast.interests}
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

      {/* Filter Button (FAB) - Bottom Right */}
      <FilterButton
        onClick={() => setIsFilterSheetOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title={t("browse.filters")}
      >
        <FilterContent
          filters={filters}
          onFilterChange={setFilters}
          availableLocations={availableLocations}
          availableInterests={availableInterests}
          resultCount={filteredAndSortedCasts.length}
          onApply={() => setIsFilterSheetOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </BottomSheet>
    </div>
  )
}
