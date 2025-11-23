"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CastCardProps = {
  id: string;
  name: string;
  age: number;
  languages: string[];
  location?: string;
  interests?: string[];
  tierClassification: "STANDARD" | "HIGH_CLASS";
  verificationStatus: "APPROVED" | "PENDING" | "REJECTED";
  isFeatured: boolean;
  photoUrl?: string;
  isBookmarked?: boolean;
  locale: string;
  onBookmarkToggle?: (castId: string, isBookmarked: boolean) => void;
};

export default function CastCard({
  id,
  name,
  age,
  languages,
  location,
  interests,
  tierClassification,
  verificationStatus,
  isFeatured,
  photoUrl,
  isBookmarked = false,
  locale,
  onBookmarkToggle,
}: CastCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

    const newBookmarkState = !bookmarked;
    setBookmarked(newBookmarkState);

    try {
      if (newBookmarkState) {
        // Add bookmark
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ castId: id }),
        });
      } else {
        // Remove bookmark
        await fetch(`/api/bookmarks?castId=${id}`, {
          method: "DELETE",
        });
      }

      if (onBookmarkToggle) {
        onBookmarkToggle(id, newBookmarkState);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      // Revert on error
      setBookmarked(!newBookmarkState);
    }
  };

  const languageLabels: Record<string, { en: string; zh: string; ja: string }> = {
    en: { en: "English", zh: "英语", ja: "英語" },
    zh: { en: "Chinese", zh: "中文", ja: "中国語" },
    ja: { en: "Japanese", zh: "日语", ja: "日本語" },
  };

  const getLanguageLabel = (lang: string) => {
    return languageLabels[lang]?.[locale as "en" | "zh" | "ja"] || lang;
  };

  return (
    <Link href={`/${locale}/browse/${id}`}>
      <Card
        className="group relative overflow-hidden border-none shadow-airbnb-md hover:shadow-airbnb-hover transition-all duration-base cursor-pointer"
        style={{
          animation: "fade-in-up 0.3s ease-out",
          borderRadius: "var(--radius-airbnb-md)"
        }}
      >
        {/* Photo Container - Airbnb 20:19 aspect ratio */}
        <div className="relative aspect-airbnb overflow-hidden bg-gray-100">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-6xl">
              👤
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-base" />

          {/* Tier Badge */}
          {tierClassification === "HIGH_CLASS" && (
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="bg-gold text-deep font-semibold px-3 py-1 shadow-md"
                style={{ backgroundColor: "var(--color-gold-vibrant)" }}
              >
                ⭐ {locale === "en" ? "Premium" : locale === "zh" ? "高级" : "プレミアム"}
              </Badge>
            </div>
          )}

          {/* Top Right Icons Container - Better spacing */}
          <div className="absolute top-3 right-3 flex items-start gap-2">
            {/* Verification Badge - Only show if verified */}
            {verificationStatus === "APPROVED" && (
              <div className="bg-success text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md flex-shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Bookmark Button */}
            <Button
              size="icon"
              variant="ghost"
              className={`bg-white/95 hover:bg-white rounded-full shadow-md flex-shrink-0 w-8 h-8 ${
                isAnimating ? "animate-bounce-heart" : ""
              }`}
              onClick={handleBookmark}
            >
              <Heart
                className={`h-4 w-4 transition-all duration-200 ${
                  bookmarked ? "fill-coral text-coral scale-110" : "text-gray-700"
                }`}
                style={bookmarked ? { fill: "var(--color-primary-coral)", color: "var(--color-primary-coral)" } : {}}
              />
            </Button>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-3 space-y-1.5">
          {/* Name & Age */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-deep truncate">
              {name}
            </h3>
            <span className="text-sm text-light ml-2">
              {age}
            </span>
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1 text-xs text-light">
              <span>📍</span>
              <span className="truncate">{location}</span>
            </div>
          )}

          {/* Languages */}
          <div className="flex flex-wrap gap-1">
            {languages.slice(0, 3).map((lang) => (
              <Badge
                key={lang}
                variant="outline"
                className="text-xs px-1.5 py-0 border-gray-200 text-light"
              >
                {getLanguageLabel(lang)}
              </Badge>
            ))}
            {languages.length > 3 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                +{languages.length - 3}
              </Badge>
            )}
          </div>

          {/* Interests */}
          {interests && interests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {interests.slice(0, 3).map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="text-xs px-1.5 py-0 bg-teal/10 text-teal border-teal/20"
                >
                  {interest}
                </Badge>
              ))}
              {interests.length > 3 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-teal/10 text-teal">
                  +{interests.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
