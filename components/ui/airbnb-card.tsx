import * as React from "react"
import { cn } from "@/lib/utils"

interface AirbnbCardProps extends React.ComponentProps<"div"> {
  hoverEffect?: boolean
}

function AirbnbCard({
  className,
  hoverEffect = true,
  ...props
}: AirbnbCardProps) {
  return (
    <div
      data-slot="airbnb-card"
      className={cn(
        "group overflow-hidden rounded-airbnb-md bg-white shadow-airbnb-md transition-shadow duration-base",
        hoverEffect && "hover:shadow-airbnb-hover cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

interface AirbnbCardImageProps extends React.ComponentProps<"div"> {
  aspectRatio?: "airbnb" | "square" | "video"
  scaleOnHover?: boolean
}

function AirbnbCardImage({
  className,
  aspectRatio = "airbnb",
  scaleOnHover = true,
  children,
  ...props
}: AirbnbCardImageProps) {
  const aspectClasses = {
    airbnb: "aspect-airbnb",
    square: "aspect-square",
    video: "aspect-video"
  }

  return (
    <div
      data-slot="airbnb-card-image"
      className={cn(
        "overflow-hidden",
        aspectClasses[aspectRatio],
        className
      )}
      {...props}
    >
      <div className={cn(
        "h-full w-full",
        scaleOnHover && "group-hover:scale-105 transition-transform duration-slow"
      )}>
        {children}
      </div>
    </div>
  )
}

function AirbnbCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="airbnb-card-content"
      className={cn("p-4 space-y-2", className)}
      {...props}
    />
  )
}

interface AirbnbCardTitleProps extends React.ComponentProps<"h3"> {
  lines?: number
}

function AirbnbCardTitle({
  className,
  lines = 1,
  ...props
}: AirbnbCardTitleProps) {
  const lineClampClasses = {
    1: "line-clamp-1",
    2: "line-clamp-2",
    3: "line-clamp-3"
  }

  return (
    <h3
      data-slot="airbnb-card-title"
      className={cn(
        "text-deep font-semibold text-base",
        lineClampClasses[lines as keyof typeof lineClampClasses] || "line-clamp-1",
        className
      )}
      {...props}
    />
  )
}

interface AirbnbCardDescriptionProps extends React.ComponentProps<"p"> {
  lines?: number
}

function AirbnbCardDescription({
  className,
  lines = 2,
  ...props
}: AirbnbCardDescriptionProps) {
  const lineClampClasses = {
    1: "line-clamp-1",
    2: "line-clamp-2",
    3: "line-clamp-3",
    4: "line-clamp-4"
  }

  return (
    <p
      data-slot="airbnb-card-description"
      className={cn(
        "text-light text-sm",
        lineClampClasses[lines as keyof typeof lineClampClasses] || "line-clamp-2",
        className
      )}
      {...props}
    />
  )
}

function AirbnbCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="airbnb-card-footer"
      className={cn("flex items-center justify-between", className)}
      {...props}
    />
  )
}

interface AirbnbCardPriceProps extends React.ComponentProps<"div"> {
  amount: string | number
  period?: string
  currency?: string
}

function AirbnbCardPrice({
  amount,
  period = "night",
  currency = "$",
  className,
  ...props
}: AirbnbCardPriceProps) {
  return (
    <div
      data-slot="airbnb-card-price"
      className={cn("text-deep font-semibold", className)}
      {...props}
    >
      <span className="text-base">{currency}{amount}</span>
      {period && <span className="text-sm font-normal text-light"> / {period}</span>}
    </div>
  )
}

interface AirbnbCardBadgeProps extends React.ComponentProps<"span"> {
  variant?: "premium" | "verified" | "exclusive" | "available"
}

function AirbnbCardBadge({
  variant = "available",
  className,
  children,
  ...props
}: AirbnbCardBadgeProps) {
  const variantClasses = {
    premium: "bg-gold text-deep",
    verified: "bg-babu text-white",
    exclusive: "bg-rose-gold text-white",
    available: "bg-babu text-white"
  }

  return (
    <span
      data-slot="airbnb-card-badge"
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export {
  AirbnbCard,
  AirbnbCardImage,
  AirbnbCardContent,
  AirbnbCardTitle,
  AirbnbCardDescription,
  AirbnbCardFooter,
  AirbnbCardPrice,
  AirbnbCardBadge,
}
