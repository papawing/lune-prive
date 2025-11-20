"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export interface FilterState {
  ageRange: [number, number]
  languages: string[]
  location: string
  interests: string[]
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void
  availableLocations: string[]
  availableInterests: string[]
}

export default function FilterPanel({
  onFilterChange,
  availableLocations,
  availableInterests,
}: FilterPanelProps) {
  const t = useTranslations()

  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 35],
    languages: [],
    location: "",
    interests: [],
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const handleAgeChange = (type: "min" | "max", value: number) => {
    const newRange: [number, number] =
      type === "min" ? [value, filters.ageRange[1]] : [filters.ageRange[0], value]

    setFilters({ ...filters, ageRange: newRange })
  }

  const toggleLanguage = (lang: string) => {
    const newLanguages = filters.languages.includes(lang)
      ? filters.languages.filter((l) => l !== lang)
      : [...filters.languages, lang]

    setFilters({ ...filters, languages: newLanguages })
  }

  const toggleInterest = (interest: string) => {
    const newInterests = filters.interests.includes(interest)
      ? filters.interests.filter((i) => i !== interest)
      : [...filters.interests, interest]

    setFilters({ ...filters, interests: newInterests })
  }

  const handleApplyFilters = () => {
    onFilterChange(filters)
  }

  const handleClearFilters = () => {
    const defaultFilters: FilterState = {
      ageRange: [18, 35],
      languages: [],
      location: "",
      interests: [],
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const languageOptions = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "ja", label: "日本語" },
  ]

  return (
    <Card className="mb-8 overflow-hidden shadow-airbnb border-0">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between md:hidden border-b border-gray-100"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🔍</span>
          <span className="font-semibold text-deep">
            {t("browse.filters") || "Filters"}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Filter Content */}
      <div
        className={`${
          isExpanded ? "block" : "hidden"
        } md:block px-6 py-6 space-y-6`}
      >
        {/* Age Range Filter */}
        <div>
          <label className="block text-sm font-semibold text-deep mb-3">
            {t("browse.ageRange") || "Age Range"}
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-light mb-1 block">Min</label>
              <input
                type="number"
                min="18"
                max="35"
                value={filters.ageRange[0]}
                onChange={(e) => handleAgeChange("min", parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-rausch focus:ring-0 transition-colors text-sm"
              />
            </div>
            <span className="text-gray-400 mt-6">–</span>
            <div className="flex-1">
              <label className="text-xs text-light mb-1 block">Max</label>
              <input
                type="number"
                min="18"
                max="35"
                value={filters.ageRange[1]}
                onChange={(e) => handleAgeChange("max", parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-rausch focus:ring-0 transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Languages Filter */}
        <div>
          <label className="block text-sm font-semibold text-deep mb-3">
            {t("browse.languages") || "Languages"}
          </label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.languages.includes(lang.code)
                    ? "bg-gradient-rausch text-white shadow-md"
                    : "bg-gray-100 text-deep hover:bg-gray-200"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-semibold text-deep mb-3">
            {t("browse.location") || "Location"}
          </label>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-rausch focus:ring-0 transition-colors text-sm"
          >
            <option value="">{t("browse.allLocations") || "All Locations"}</option>
            {availableLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Interests Filter */}
        {availableInterests.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-deep mb-3">
              {t("browse.interests") || "Interests"}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filters.interests.includes(interest)
                      ? "bg-gradient-rausch text-white shadow-sm"
                      : "bg-gray-100 text-deep hover:bg-gray-200"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button
            onClick={handleApplyFilters}
            variant="airbnb"
            className="flex-1"
          >
            {t("browse.applyFilters") || "Apply Filters"}
          </Button>
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="px-6"
          >
            {t("browse.clear") || "Clear"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
