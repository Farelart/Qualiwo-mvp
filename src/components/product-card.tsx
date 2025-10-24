"use client";

import type { Product } from "@/ai/tools";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store-simple";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { X } from "lucide-react";

export type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, incrementItem, decrementItem, getItemQuantity } =
    useCartStore();
  const cartQuantity = getItemQuantity(product.name);
  const { addToast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the sheet when clicking the button
    if (cartQuantity === 0) {
      addItem(product, 1);
      // Show toast notification
      addToast({
        title: "Added to cart! 🛒",
        description: `${product.name}`,
        image: product.image,
        duration: 3000,
      });
    } else {
      incrementItem(product.name);
      // Show toast notification
      addToast({
        title: "Updated cart! ✨",
        description: `${product.name} (Qty: ${cartQuantity + 1})`,
        image: product.image,
        duration: 10000,
      });
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the sheet when clicking the button
    decrementItem(product.name);
  };

  return (
    <>
      <div
        onClick={() => setIsSheetOpen(true)}
        className="bg-[#30302e] rounded-xl shadow-md overflow-hidden w-56 flex-shrink-0 border border-gray-700 hover:shadow-lg hover:border-[#d97757]/50 transition-all cursor-pointer"
      >
        {/* Product Image */}
        <div className="aspect-square bg-[#30302e] flex items-center justify-center relative group">
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={450}
            height={450}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Product Infos */}
        <div className="p-3">
          {/* Brand */}
          <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
            {product.brand}
          </span>

          {/* Product Name */}
          <h3 className="font-medium text-white text-sm mb-2 line-clamp-2 leading-tight mt-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-[#d97757]">
              {Math.round(parseFloat(product.priceEuro) * 655).toLocaleString()} fcfa
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                disabled={cartQuantity === 0}
                className="bg-[#d97757] text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#c86a4a] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-medium text-white text-sm">
                {cartQuantity}
              </span>
              <button
                onClick={handleIncrement}
                className="bg-[#d97757] text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#c86a4a] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cart Status Badge */}
            {cartQuantity > 0 && (
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                {cartQuantity}
              </span>
            )}
          </div>
        </div>
      </div>

    {/* Product Details Sheet */}
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="bg-[#1e1a16] border-l border-gray-700 text-white overflow-y-auto w-[90vw] sm:w-[85vw] sm:max-w-md p-0">
        {/* Accessible Title (visually hidden) */}
        <SheetTitle className="sr-only">{product.name}</SheetTitle>

        {/* Custom Close Button - Highly Visible */}
        <SheetClose className="absolute top-4 right-4 z-50 bg-[#d97757] hover:bg-[#c86a4a] text-white rounded-full p-2 shadow-lg transition-colors">
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </SheetClose>

        {/* Product Image Header */}
        <div className="relative h-64 sm:h-80 bg-[#30302e]">
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            width={600}
            height={600}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1a16] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 -mt-12 sm:-mt-16 relative z-10">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-amber-600/20 border border-amber-600/30 rounded-full">
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                {product.brand}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight pr-8">
              {product.name}
            </h2>
          </div>

          {/* Price Card */}
          <div className="bg-[#262624] border border-gray-700 rounded-xl p-3 sm:p-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#d97757]">
                {Math.round(parseFloat(product.priceEuro) * 655).toLocaleString()}
              </span>
              <span className="text-base sm:text-lg text-[#d97757]">fcfa</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              ≈ €{parseFloat(product.priceEuro).toFixed(2)}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Color */}
            <div className="bg-[#262624] border border-gray-700 rounded-xl p-3 sm:p-4">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Color</div>
              <div className="text-white font-medium capitalize text-sm">{product.color}</div>
            </div>

            {/* Stock Status */}
            <div className="bg-[#262624] border border-gray-700 rounded-xl p-3 sm:p-4">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</div>
              <div className="text-green-500 font-medium text-sm">In Stock</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category, index) => (
                <span
                  key={index}
                  className="text-xs bg-[#262624] border border-gray-700 text-gray-300 px-2.5 sm:px-3 py-1.5 rounded-lg"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="sticky bottom-0 bg-[#1e1a16] pt-4 sm:pt-6 pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6 border-t border-gray-700">
            <div className="bg-[#262624] border border-gray-700 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Quantity
                </h3>
                {cartQuantity > 0 && (
                  <span className="text-xs bg-green-500/20 border border-green-500/30 text-green-400 px-2.5 sm:px-3 py-1 rounded-full font-medium">
                    {cartQuantity} in cart
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={handleDecrement}
                  disabled={cartQuantity === 0}
                  className="bg-[#d97757] text-white w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-[#c86a4a] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <span className="w-14 sm:w-16 text-center font-bold text-white text-xl sm:text-2xl">
                  {cartQuantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="bg-[#d97757] text-white w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-[#c86a4a] transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </>
  );
};
