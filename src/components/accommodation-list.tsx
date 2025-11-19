"use client";

import { Accommodation } from "@/search/types";
import { AccommodationCard } from "./accommodation-card";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AccommodationListProps {
  query: string;
  accommodations: Accommodation[];
  totalFound: number;
}

export const AccommodationList = ({ query, accommodations, totalFound }: AccommodationListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
  }, [accommodations]);

  if (accommodations.length === 0) {
    return (
      <div className="bg-[#262624] rounded-lg p-6 text-center my-4">
        <div className="text-white mb-2">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-[#d97757] mb-2">
          No accommodations found
        </h3>
        <p className="text-gray-300">
          Sorry, we couldn&apos;t find any accommodations matching {query}. Try a
          different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#262624] rounded-xl border border-gray-700 p-4 my-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#d97757] mb-1">
          Accommodations matching: {query}
        </h3>
        <p className="text-sm text-white">
          Found {totalFound} accommodation{totalFound !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Scrollable container with navigation */}
      <div className="relative">
        {/* Left scroll button */}
        {showLeftButton && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#d97757] hover:bg-[#c86647] text-white p-2 rounded-full shadow-lg transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right scroll button */}
        {showRightButton && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#d97757] hover:bg-[#c86647] text-white p-2 rounded-full shadow-lg transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Accommodation list container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide"
          onScroll={checkScrollButtons}
        >
          <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
            {accommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

