"use client";

import { Accommodation } from "@/search/types";
import Image from "next/image";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCartStoreNew } from "@/store/cart-store-new";
import { useToast } from "@/components/ui/toast";
import { MapPin, Users, Bed, Bath, Plus, Minus } from "lucide-react";
import { getSafeImageUrl, getPlaceholderImage } from "@/lib/image-utils";

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export const AccommodationCard = ({ accommodation }: AccommodationCardProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem, incrementItem, decrementItem, getItemQuantity } = useCartStoreNew();
  const { addToast } = useToast();
  const cartQuantity = getItemQuantity(accommodation.id);

  const handleAddToCart = () => {
    addItem({
      id: accommodation.id,
      type: "accommodation",
      name: accommodation.name,
      price: accommodation.price.perNight,
      currency: accommodation.price.currency,
      image: accommodation.images?.[0] || accommodation.image || "",
      source: accommodation.meta.source,
    });
    addToast({
      title: "Added to cart!",
      description: accommodation.name,
      image: accommodation.images?.[0] || accommodation.image || undefined,
    });
    setIsSheetOpen(false);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartQuantity === 0) {
      addItem({
        id: accommodation.id,
        type: "accommodation",
        name: accommodation.name,
        price: accommodation.price.perNight,
        currency: accommodation.price.currency,
        image: accommodation.images?.[0] || accommodation.image || "",
        source: accommodation.meta.source,
      });
      addToast({
        title: "Added to cart! 🛒",
        description: accommodation.name,
      });
    } else {
      incrementItem(accommodation.id);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    decrementItem(accommodation.id);
  };

  // Try images array first, then fall back to single image field
  const [imageError, setImageError] = useState(false);
  const mainImage = accommodation.images?.[0] || accommodation.image || "";
  const imageCount = accommodation.images?.length || 0;
  const safeImageUrl = getSafeImageUrl(mainImage);
  const displayImage = imageError ? getPlaceholderImage() : safeImageUrl;

  return (
    <>
      <div
        onClick={() => setIsSheetOpen(true)}
        className="bg-[#30302e] rounded-xl shadow-md overflow-hidden w-72 flex-shrink-0 border border-gray-700 hover:shadow-lg hover:border-[#d97757]/50 transition-all cursor-pointer"
      >
        {/* Accommodation Image */}
        <div className="aspect-[4/3] bg-[#30302e] flex items-center justify-center relative group">
          <Image
            src={displayImage}
            alt={accommodation.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={450}
            height={338}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getPlaceholderImage();
              setImageError(true);
            }}
          />
          {imageCount > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              +{imageCount - 1} photos
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Accommodation Info */}
        <div className="p-3">
          {/* Location */}
          {accommodation.location && (
            <div className="flex items-center gap-1 text-xs text-amber-600 mb-1">
              <MapPin className="w-3 h-3" />
              <span>{accommodation.location.city}, {accommodation.location.country}</span>
            </div>
          )}

          {/* Name */}
          <h3 className="font-medium text-white text-sm mb-2 line-clamp-2 leading-tight">
            {accommodation.name}
          </h3>

          {/* Capacity Info */}
          {accommodation.capacity && (
            <div className="flex gap-3 text-xs text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{accommodation.capacity.guests}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="w-3 h-3" />
                <span>{accommodation.capacity.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-3 h-3" />
                <span>{accommodation.capacity.bathrooms}</span>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-[#d97757]">
              ${(accommodation.price.perNight / 100).toFixed(2)}
            </span>
            <span className="text-xs text-gray-400"> / night</span>
          </div>

          {/* Add to Cart Controls */}
          <div className="flex items-center justify-between">
            {cartQuantity === 0 ? (
              <button
                onClick={handleIncrement}
                className="w-8 h-8 bg-[#d97757] hover:bg-[#c86647] text-white rounded-full flex items-center justify-center transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-semibold text-base min-w-[1.5rem] text-center">{cartQuantity}</span>
                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 bg-[#d97757] hover:bg-[#c86647] text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {cartQuantity > 0 && (
              <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {cartQuantity} in cart
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className="bg-[#1e1a16] border-t border-gray-700 h-[90vh] overflow-y-auto"
        >
          <SheetTitle className="sr-only">{accommodation.name}</SheetTitle>

          {/* Image Gallery */}
          <div className="relative h-64 sm:h-80 bg-[#30302e]">
            <Image
              src={getSafeImageUrl(accommodation.images?.[currentImageIndex] || mainImage)}
              alt={accommodation.name}
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

            {/* Image navigation dots */}
            {imageCount > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {accommodation.images?.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Location Badge */}
            <div className="flex items-center gap-2">
              {accommodation.location && (
                <div className="inline-flex items-center gap-1 bg-amber-600/20 text-amber-600 px-3 py-1 rounded-full text-xs font-medium">
                  <MapPin className="w-3 h-3" />
                  {accommodation.location.city}, {accommodation.location.country}
                </div>
              )}
              {accommodation.attributes?.superhost && (
                <div className="inline-block bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                  Superhost
                </div>
              )}
            </div>

            {/* Name */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {accommodation.name}
            </h2>

            {/* Space Type */}
            {accommodation.attributes && (
              <div className="text-gray-300">
                {accommodation.attributes.spaceType} • {accommodation.attributes.roomType.replace(/_/g, " ")}
              </div>
            )}

            {/* Capacity Info */}
            {accommodation.capacity && (
              <div className="flex gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{accommodation.capacity.guests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4" />
                  <span>{accommodation.capacity.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4" />
                  <span>{accommodation.capacity.bathrooms} bathrooms</span>
                </div>
              </div>
            )}

            {/* Price Card */}
            <div className="bg-[#262624] border border-gray-700 rounded-xl p-3 sm:p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#d97757]">
                  ${(accommodation.price.perNight / 100).toFixed(2)}
                </span>
                <span className="text-base sm:text-lg text-gray-400">per night</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{accommodation.description}</p>
            </div>

            {/* Reviews */}
            {accommodation.rating && accommodation.rating.reviewsCount > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Reviews</h3>
                <div className="text-gray-300">
                  {accommodation.rating.reviewsCount} review{accommodation.rating.reviewsCount !== 1 ? "s" : ""}
                  {accommodation.rating.score && (
                    <span className="ml-2">• ⭐ {accommodation.rating.score.toFixed(1)}</span>
                  )}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#d97757] hover:bg-[#c86647] text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-colors"
            >
              Add to Cart
            </button>

            {/* View on Source */}
            {accommodation.meta.url && (
              <a
                href={accommodation.meta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#262624] hover:bg-[#30302e] text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-colors border border-gray-700"
              >
                View on {accommodation.meta.source}
              </a>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

