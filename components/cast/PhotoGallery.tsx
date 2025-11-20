"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Photo = {
  id: string;
  url: string;
  caption?: string | null;
};

type PhotoGalleryProps = {
  photos: Photo[];
  castName: string;
};

export default function PhotoGallery({ photos, castName }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full aspect-[16/10] bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-8xl text-gray-400">👤</span>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Airbnb-style grid: 1 large photo + 4 small photos in 2x2 grid
  const mainPhoto = photos[0];
  const secondaryPhotos = photos.slice(1, 5);

  return (
    <>
      {/* Photo Grid - Mobile: Single column, Tablet+: Airbnb grid */}
      <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-4 sm:grid-rows-2 sm:gap-2 sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
        {/* Main Photo */}
        <div
          className="aspect-[4/3] sm:aspect-auto sm:col-span-2 sm:row-span-2 relative cursor-pointer group overflow-hidden rounded-xl sm:rounded-none"
          onClick={() => openLightbox(0)}
        >
          <img
            src={mainPhoto.url}
            alt={`${castName} - Photo 1`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-base" />
        </div>

        {/* Secondary Photos - Hidden on mobile, shown on tablet+ */}
        <div className="hidden sm:contents">
          {secondaryPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => openLightbox(index + 1)}
            >
              <img
                src={photo.url}
                alt={`${castName} - Photo ${index + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-base" />

              {/* Show "View All Photos" on last image if more than 5 photos */}
              {index === secondaryPhotos.length - 1 && photos.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm lg:text-base">
                    +{photos.length - 5} more
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Fill empty slots if less than 5 photos */}
          {Array.from({ length: Math.max(0, 4 - secondaryPhotos.length) }).map(
            (_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-gray-200 flex items-center justify-center"
              >
                <span className="text-gray-400 text-4xl">📷</span>
              </div>
            )
          )}
        </div>

        {/* Mobile: Show "View All Photos" button if more photos */}
        {photos.length > 1 && (
          <button
            onClick={() => openLightbox(1)}
            className="sm:hidden w-full bg-white rounded-xl p-4 shadow-airbnb-sm border border-gray-200 hover:shadow-airbnb-md transition-shadow flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📸</span>
            <span className="font-semibold text-deep">
              View All {photos.length} Photos
            </span>
          </button>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            {photos.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Current Photo */}
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
              <img
                src={photos[currentIndex].url}
                alt={`${castName} - Photo ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />

              {/* Photo Caption */}
              {photos[currentIndex].caption && (
                <p className="text-white mt-4 text-center max-w-2xl">
                  {photos[currentIndex].caption}
                </p>
              )}

              {/* Photo Counter */}
              <p className="text-white/70 mt-4 text-sm">
                {currentIndex + 1} / {photos.length}
              </p>
            </div>

            {/* Next Button */}
            {photos.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
