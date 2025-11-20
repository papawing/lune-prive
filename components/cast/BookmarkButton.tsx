"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type BookmarkButtonProps = {
  castId: string;
  initialBookmarked: boolean;
};

export default function BookmarkButton({
  castId,
  initialBookmarked,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = async () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

    const newState = !bookmarked;
    setBookmarked(newState);

    try {
      if (newState) {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ castId }),
        });
      } else {
        await fetch(`/api/bookmarks?castId=${castId}`, {
          method: "DELETE",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setBookmarked(!newState);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleToggle}
      className={`rounded-full hover:bg-gray-100 ${
        isAnimating ? "animate-bounce-heart" : ""
      }`}
    >
      <Heart
        className={`h-6 w-6 transition-colors ${
          bookmarked ? "fill-coral text-coral" : "text-gray-400"
        }`}
        style={
          bookmarked
            ? {
                fill: "var(--color-primary-coral)",
                color: "var(--color-primary-coral)",
              }
            : {}
        }
      />
    </Button>
  );
}
