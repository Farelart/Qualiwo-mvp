"use client";

import { Product } from "@/search/types";
import Image from "next/image";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart-store-simple";
import { useToast } from "@/components/ui/toast";
import { getSafeImageUrl, getPlaceholderImage } from "@/lib/image-utils";

interface ProductCardNewProps {
  product: Product;
}

export const ProductCardNew = ({ product }: ProductCardNewProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { addItem } = useCartStore();
  const { addToast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      type: "product",
      name: product.name,
      price: product.price.amount,
      currency: product.price.currency,
      image: product.image,
      source: product.meta.source,
    });
    addToast({
      title: "Added to cart!",
      description: product.name,
      image: product.image,
    });
    setIsSheetOpen(false);
  };

  const [imageError, setImageError] = useState(false);
  const safeImageUrl = getSafeImageUrl(product.image);
  const displayImage = imageError ? getPlaceholderImage() : safeImageUrl;

  return (
    <>
      <div
        onClick={() => setIsSheetOpen(true)}
        className="bg-[#30302e] rounded-xl shadow-md overflow-hidden w-56 flex-shrink-0 border border-gray-700 hover:shadow-lg hover:border-[#d97757]/50 transition-all cursor-pointer"
      >
        {/* Product Image */}
        <div className="aspect-square bg-[#30302e] flex items-center justify-center relative group">
          <Image
            src={displayImage}
            alt={product.name}
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

        {/* Product Info */}
        <div className="p-3">
          {/* Brand */}
          <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
            {product.attributes.brand}
          </span>

          {/* Product Name */}
          <h3 className="font-medium text-white text-sm mb-2 line-clamp-2 leading-tight mt-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-[#d97757]">
              {product.price.amount.toLocaleString()} {product.price.currency}
            </span>
          </div>

          {/* Category */}
          {product.categories.length > 0 && (
            <div className="text-xs text-gray-400">
              {product.categories[0]}
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
          <SheetTitle className="sr-only">{product.name}</SheetTitle>

          {/* Product Image Header */}
          <div className="relative h-64 sm:h-80 bg-[#30302e]">
            <Image
              src={displayImage}
              alt={product.name}
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
            {/* Brand Badge */}
            <div className="inline-block bg-amber-600/20 text-amber-600 px-3 py-1 rounded-full text-xs font-medium">
              {product.attributes.brand}
            </div>

            {/* Product Name */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {product.name}
            </h2>

            {/* Price Card */}
            <div className="bg-[#262624] border border-gray-700 rounded-xl p-3 sm:p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#d97757]">
                  {product.price.amount.toLocaleString()}
                </span>
                <span className="text-base sm:text-lg text-[#d97757]">{product.price.currency}</span>
              </div>
              {product.price.amount_eur && (
                <div className="text-sm text-gray-400 mt-1">
                  ≈ €{(product.price.amount_eur / 100).toFixed(2)}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#262624] border border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Color</div>
                <div className="text-white font-medium capitalize">{product.attributes.color}</div>
              </div>
              <div className="bg-[#262624] border border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Source</div>
                <div className="text-white font-medium">{product.meta.source}</div>
              </div>
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

