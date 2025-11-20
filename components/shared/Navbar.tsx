"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import { localeNames, type Locale } from "@/i18n/config"

export default function Navbar() {
  const t = useTranslations()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = params.locale as Locale

  const changeLocale = (newLocale: Locale) => {
    // This will be handled by the Link component with locale prop
    const newUrl = `/${newLocale}${pathname}`
    window.location.href = newUrl
  }

  return (
    <header className="sticky top-0 left-0 right-0 w-full bg-white border-b border-gray-100 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-20 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl">🌙</span>
            <span className="font-display text-xl font-bold text-deep">
              {t("common.appName")}
            </span>
          </Link>

          {/* Center - Search (hidden on mobile) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
            {/* SearchBar component will go here */}
          </div>

          {/* Right Side - Navigation & Auth */}
          <div className="flex items-center gap-3">
            {/* Become a Host (hidden on mobile) */}
            <Link
              href="/become-cast"
              className="hidden md:block text-[#222222] font-semibold hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
            >
              {t("nav.becomeCast") || "Become a Cast"}
            </Link>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="rounded-full">
                  <span className="text-lg">🌐</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-airbnb-md">
                {Object.entries(localeNames).map(([locale, name]) => (
                  <DropdownMenuItem
                    key={locale}
                    onClick={() => changeLocale(locale as Locale)}
                    className={currentLocale === locale ? "bg-gray-100 font-semibold" : ""}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <div className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-full hover:shadow-md transition-shadow cursor-pointer">
              <svg className="w-4 h-4 text-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (visible only on mobile) */}
      <div className="lg:hidden px-4 pb-4">
        {/* Compact SearchBar component will go here */}
      </div>
    </header>
  )
}
