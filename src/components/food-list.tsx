"use client";

import { Food } from "@/search/types";
import { FoodCard } from "./food-card";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface FoodListProps {
  query: string;
  foods: Food[];
  totalFound: number;
}

export const FoodList = ({ query, foods, totalFound }: FoodListProps) => {
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
  }, [foods]);

  if (foods.length === 0) {
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
          No food items found
        </h3>
        <p className="text-gray-300">
          Sorry, we couldn&apos;t find any food items matching {query}. Try a
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
          Food items matching: {query}
        </h3>
        <p className="text-sm text-white">
          Found {totalFound} item{totalFound !== 1 ? "s" : ""}
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

        {/* Food list container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide"
          onScroll={checkScrollButtons}
        >
          <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

