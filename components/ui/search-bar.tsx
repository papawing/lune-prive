"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps extends React.ComponentProps<"div"> {
  onSearch?: () => void
  fields?: SearchField[]
}

interface SearchField {
  label: string
  placeholder: string
  value?: string
  onChange?: (value: string) => void
  type?: "text" | "date" | "number"
}

function SearchBar({
  className,
  onSearch,
  fields = [],
  ...props
}: SearchBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-6 py-3 bg-white rounded-full shadow-airbnb-md hover:shadow-airbnb-lg transition-shadow duration-base",
        className
      )}
      {...props}
    >
      {fields.map((field, index) => (
        <React.Fragment key={index}>
          <SearchBarField {...field} />
          {index < fields.length - 1 && (
            <div className="h-8 w-px bg-gray-200" />
          )}
        </React.Fragment>
      ))}

      <button
        onClick={onSearch}
        className="w-12 h-12 rounded-full bg-rausch text-white flex items-center justify-center hover:scale-105 transition-transform duration-fast shadow-md"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  )
}

interface SearchBarFieldProps extends SearchField {
  className?: string
}

function SearchBarField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  className,
}: SearchBarFieldProps) {
  return (
    <div className={cn("flex-1 min-w-0", className)}>
      <label className="block text-xs font-semibold text-deep mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm text-light placeholder:text-gray-300 bg-transparent border-none focus:outline-none"
      />
    </div>
  )
}

// Compact version for mobile
interface CompactSearchBarProps extends React.ComponentProps<"button"> {
  placeholder?: string
}

function CompactSearchBar({
  className,
  placeholder = "Search...",
  ...props
}: CompactSearchBarProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 bg-white rounded-full shadow-airbnb-md hover:shadow-airbnb-lg transition-shadow duration-base text-left",
        className
      )}
      {...props}
    >
      <Search className="w-5 h-5 text-deep shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-deep">
          {placeholder}
        </div>
        <div className="text-xs text-light">
          Anywhere • Any date • Add guests
        </div>
      </div>
    </button>
  )
}

export { SearchBar, CompactSearchBar, type SearchField }
