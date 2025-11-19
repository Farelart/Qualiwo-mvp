"use client";

import { useCartStore } from "@/store/cart-store-simple";
import Image from "next/image";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export const CartSummary = () => {
  const { items, totalPrice, incrementItem, decrementItem, removeItem, clearCart } =
    useCartStore();
  const { sendMessage } = useChat();

  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);

  const handlePaymentClick = () => {
    setShowPaymentPrompt(true);
    // Send message to AI asking for payment info
    sendMessage({
      text: "Je veux payer maintenant",
    });
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#262624] rounded-xl border border-gray-700 p-6 sm:p-8 my-4">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-500" />
          <h3 className="text-lg sm:text-xl font-semibold text-[#d97757] mb-2">
            Your cart is empty
          </h3>
          <p className="text-sm sm:text-base text-gray-300">
            Add some products to your cart to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#262624] rounded-xl border border-gray-700 p-4 sm:p-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#d97757]" />
          <h3 className="text-lg sm:text-xl font-semibold text-[#d97757]">Your Cart</h3>
        </div>
        <button
          onClick={clearCart}
          className="text-xs sm:text-sm text-white hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Clear All
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        {items.map((item) => {
          const priceEuro = parseFloat(item.product.priceEuro);
          const priceFcfa = Math.round(priceEuro * 655);
          const itemTotalFcfa = priceFcfa * item.quantity;

          return (
            <div
              key={item.id}
              className="bg-[#30302e] rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4 border border-gray-700"
            >
              {/* Product Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-[#3a3a38] rounded-lg overflow-hidden">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-product.png";
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-white font-medium text-xs sm:text-sm line-clamp-2 mb-0.5 sm:mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-amber-600">{item.product.brand}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-0.5 sm:p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Price and Quantity Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
                  {/* Price */}
                  <div className="flex flex-col">
                    <div className="text-[#d97757] font-bold text-sm sm:text-base">
                      {itemTotalFcfa.toLocaleString()} fcfa
                    </div>
                    <div className="text-xs text-gray-400">
                      {priceFcfa.toLocaleString()} fcfa each
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-[#262624] rounded-full px-2 py-1 self-start sm:self-auto">
                    <button
                      onClick={() => decrementItem(item.id)}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </button>
                    <span className="text-white font-medium min-w-[1.5rem] sm:min-w-[2rem] text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementItem(item.id)}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#d97757] hover:bg-[#c86647] flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="border-t border-gray-700 pt-3 sm:pt-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="text-gray-300 text-xs sm:text-sm">
            Total Items: <span className="font-semibold text-white">{items.length}</span>
          </span>
          <span className="text-gray-300 text-xs sm:text-sm">
            Total Quantity:{" "}
            <span className="font-semibold text-white">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </span>
        </div>

        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <span className="text-base sm:text-lg font-semibold text-white">Total:</span>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-[#d97757]">
              {Math.round(totalPrice * 655).toLocaleString()} fcfa
            </div>
            <div className="text-xs text-gray-400">
              ≈ €{totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePaymentClick}
          className="w-full bg-[#d97757] hover:bg-[#c86647] text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-full transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          Proceed to Payment
        </button>

        {/* Payment Info Prompt */}
        {showPaymentPrompt && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-[#30302e] border border-[#d97757]/50 rounded-xl">
            <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
              Please provide your information in the chat to complete the payment:
            </p>
            <ul className="text-gray-400 text-xs space-y-1 ml-4">
              <li>• Votre prénom (Your first name)</li>
              <li>• Votre numéro de téléphone (Your phone number)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

