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

          {/* Verification Badge */}
          {verificationStatus === "APPROVED" && (
            <div className="absolute top-3 right-14">
              <div className="bg-success text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                ✓
              </div>
            </div>
          )}

          {/* Bookmark Button */}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full shadow-md ${
              isAnimating ? "animate-bounce-heart" : ""
            }`}
            onClick={handleBookmark}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                bookmarked ? "fill-coral text-coral" : "text-gray-600"
              }`}
              style={bookmarked ? { fill: "var(--color-primary-coral)", color: "var(--color-primary-coral)" } : {}}
            />
          </Button>

          {/* Featured Ribbon */}
          {isFeatured && (
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-r-[60px] border-t-rose-gold border-r-transparent">
              <span className="absolute -top-14 right-1 text-white text-xs rotate-45 transform">
                ⭐
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardContent className="p-4 space-y-2">
          {/* Name & Age */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-deep truncate">
              {name}
            </h3>
            <span className="text-sm text-light ml-2">
              {age}
            </span>
          </div>

          {/* Languages */}
          <div className="flex flex-wrap gap-1">
            {languages.slice(0, 3).map((lang) => (
              <Badge
                key={lang}
                variant="outline"
                className="text-xs px-2 py-0.5 border-gray-200 text-light"
              >
                {getLanguageLabel(lang)}
              </Badge>
            ))}
            {languages.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{languages.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
