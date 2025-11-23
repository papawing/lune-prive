"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  className,
}: BottomSheetProps) {
  const [isAnimating, setIsAnimating] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      // Prevent body scroll when bottom sheet is open
      document.body.style.overflow = "hidden"
    } else {
      // Re-enable body scroll when closed
      const timeout = setTimeout(() => {
        setIsAnimating(false)
        document.body.style.overflow = ""
      }, 300) // Match animation duration
      return () => clearTimeout(timeout)
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out",
          "max-h-[90vh] flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full",
          className
        )}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-deep">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </>
  )
}
