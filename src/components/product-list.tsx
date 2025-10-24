import { ProductCard } from "./product-card";
import type { Product } from "@/ai/tools";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ProductListProps = {
  query: string;
  products: Product[];
  totalFound: number;
};

export const ProductList = ({
  query,
  products,
  totalFound,
}: ProductListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -280, // Scroll by one card width + gap
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 280, // Scroll by one card width + gap
        behavior: "smooth",
      });
    }
  };

  // Check scroll buttons on mount and when products change
  useEffect(() => {
    checkScrollButtons();
  }, [products]);
  if (products.length === 0) {
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
          No products found
        </h3>
        <p className="text-gray-300">
          Sorry, we couldn&apos;t find any products matching {query}. Try a
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
          Products matching : {query}
        </h3>
        <p className="text-sm text-white">
          Found {totalFound} product{totalFound !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Product list with arrow navigation */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#d97757]/90 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-[#c86a4a] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#d97757]/90 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-[#c86a4a] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Product list container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide"
          onScroll={checkScrollButtons}
        >
          <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
