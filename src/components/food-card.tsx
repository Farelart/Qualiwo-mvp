"use client";

import { Food } from "@/search/types";
import Image from "next/image";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart-store-simple";
import { useToast } from "@/components/ui/toast";
import { getSafeImageUrl, getPlaceholderImage } from "@/lib/image-utils";

interface FoodCardProps {
  food: Food;
}

export const FoodCard = ({ food }: FoodCardProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { addItem } = useCartStore();
  const { addToast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: food.id,
      type: "food",
      name: food.name,
      price: food.price.amount,
      currency: food.price.currency,
      image: food.image,
      source: food.meta.source,
    });
    addToast({
      title: "Added to cart!",
      description: food.name,
      image: food.image,
    });
    setIsSheetOpen(false);
  };

  const [imageError, setImageError] = useState(false);
  const safeImageUrl = getSafeImageUrl(food.image); // Now uses proxy for Google Drive

  // If image failed to load or is invalid, show placeholder
  const displayImage = imageError ? getPlaceholderImage() : safeImageUrl;

  return (
    <>
      <div
        onClick={() => setIsSheetOpen(true)}
        className="bg-[#30302e] rounded-xl shadow-md overflow-hidden w-56 flex-shrink-0 border border-gray-700 hover:shadow-lg hover:border-[#d97757]/50 transition-all cursor-pointer"
      >
        {/* Food Image */}
        <div className="aspect-square bg-[#30302e] flex items-center justify-center relative group">
          <Image
            src={displayImage}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={450}
            height={450}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getPlaceholderImage();
              setImageError(true);
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Food Info */}
        <div className="p-3">
          {/* Source */}
          <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
            {food.meta.source}
          </span>

          {/* Food Name */}
          <h3 className="font-medium text-white text-sm mb-2 line-clamp-2 leading-tight mt-1">
            {food.name}
          </h3>

          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-[#d97757]">
              {food.price.amount.toLocaleString()} {food.price.currency}
            </span>
          </div>

          {/* Category */}
          {food.categories.length > 0 && (
            <div className="text-xs text-gray-400">
              {food.categories[0]}
            </div>
          )}
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className="bg-[#1e1a16] border-t border-gray-700 h-[90vh] overflow-y-auto"
        >
          <SheetTitle className="sr-only">{food.name}</SheetTitle>

          {/* Food Image Header */}
          <div className="relative h-64 sm:h-80 bg-[#30302e]">
            <Image
              src={displayImage}
              alt={food.name}
              className="w-full h-full object-cover"
              width={600}
              height={600}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getPlaceholderImage();
                setImageError(true);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1a16] via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Source Badge */}
            <div className="inline-block bg-amber-600/20 text-amber-600 px-3 py-1 rounded-full text-xs font-medium">
              {food.meta.source}
            </div>

            {/* Food Name */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {food.name}
            </h2>

            {/* Price Card */}
            <div className="bg-[#262624] border border-gray-700 rounded-xl p-3 sm:p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#d97757]">
                  {food.price.amount.toLocaleString()}
                </span>
                <span className="text-base sm:text-lg text-[#d97757]">{food.price.currency}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{food.description}</p>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#d97757] hover:bg-[#c86647] text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

