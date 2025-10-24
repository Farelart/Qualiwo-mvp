"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { ProductList } from "@/components/product-list";
import type { ProductListProps } from "@/components/product-list";
import { ProductCard } from "@/components/product-card";
import { CartSummary } from "@/components/cart-summary";
import { Streamdown } from "streamdown";
import { useCartStore } from "@/store/cart-store-simple";
import { useToast } from "@/components/ui/toast";

export default function Page() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const { clearCart } = useCartStore();
  const { addToast } = useToast();
  const lastProcessedPaymentRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [messages, isUserScrolling]);

  // Detect payment completion and clear cart
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Check if the last AI message contains "Payment completed successfully"
      if (lastMessage.role === "assistant") {
        const textParts = lastMessage.parts.filter((part) => part.type === "text");
        const fullText = textParts.map((part) => part.text).join("");

        if (fullText.includes("Payment completed successfully")) {
          // Only process if we haven't already processed this message
          if (lastProcessedPaymentRef.current !== lastMessage.id) {
            lastProcessedPaymentRef.current = lastMessage.id;

            // Clear the cart
            clearCart();

            // Show payment completion notification (only once)
            addToast({
              title: "Payment Complete! ✅",
              description: "Your order has been successfully processed.",
              duration: 4000,
            });
          }
        }
      }
    }
  }, [messages, clearCart, addToast]);

  // Detect user scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;

    // If user is at bottom, allow auto-scroll
    // If user scrolls up, disable auto-scroll
    if (isAtBottom) {
      setIsUserScrolling(false);
    } else {
      setIsUserScrolling(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUserScrolling(false); // Re-enable auto-scroll when user sends message

    // Start fade-out animation
    if (showWelcome) {
      setWelcomeVisible(false);
      // Hide welcome after animation completes
      setTimeout(() => {
        setShowWelcome(false);
      }, 3000); // Match the CSS transition duration
    }

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Chat messages area - takes remaining space and is scrollable */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide max-w-3xl mx-auto w-full"
        onScroll={handleScroll}
      >
        {/* Welcome Message */}
        {showWelcome && messages.length === 0 && (
          <div
            className={`flex justify-center items-center h-full transition-opacity duration-1000   ease-in-out ${
              welcomeVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="text-center max-w-2xl px-4">
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to Qualiwo🔥
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                Start shopping by asking for products!
              </p>

              {/* Product Categories */}
              <div className="bg-[#262624] rounded-lg border border-gray-500/70 p-6 mt-6">
                <h2 className="text-xl font-semibold text-[#d97757] mb-4">
                  Here are the products you can buy:
                </h2>
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-2xl">📱</span>
                    <span>Phones</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-2xl">💻</span>
                    <span>Laptops</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-2xl">🎮</span>
                    <span>Gaming</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-2xl">👕</span>
                    <span>Fashion & Apparel</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-2xl">🏠</span>
                    <span>Home & Office</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-2xl">💄</span>
                    <span>Health & Beauty</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-2xl">⚽</span>
                    <span>Sports & Outdoor</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-2xl">🧸</span>
                    <span>Toys & Books</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-2xl">🎒</span>
                    <span>Bags & Travel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[95%] p-3 rounded-3xl ${
                message.role === "user"
                  ? "bg-[#d97757] text-white"
                  : " text-white"
              }`}
            >
              {(() => {
                // Check if there's a text part in the message
                const hasTextPart = message.parts.some((part) => part.type === "text");

                // Get the text content and split by separators
                const textParts = message.parts.filter((part) => part.type === "text");
                const fullText = textParts.map((part) => part.text).join("");

                // Split by product list separator first
                const [beforeProducts, afterProductList] = fullText.split("|||PRODUCT_LIST|||");

                // Then split the second part by recommended product separator
                let middleText = "";
                let afterRecommended = "";
                let recommendedIndex = -1;

                if (afterProductList) {
                  const recommendedMatch = afterProductList.match(/^([\s\S]*?)\|\|\|RECOMMENDED_PRODUCT:(\d+)\|\|\|([\s\S]*)/);
                  if (recommendedMatch) {
                    middleText = recommendedMatch[1];
                    recommendedIndex = parseInt(recommendedMatch[2], 10);
                    afterRecommended = recommendedMatch[3];
                  } else {
                    // Fallback if no recommended product separator found
                    afterRecommended = afterProductList;
                  }
                }

                // Get product list parts
                const productParts = message.parts.filter(
                  (part) => part.type === "tool-searchProducts"
                );

                // Get the recommended product
                const productOutput = productParts.find(
                  (part) => part.type === "tool-searchProducts" &&
                           "state" in part &&
                           part.state === "output-available"
                );
                const recommendedProduct =
                  productOutput &&
                  "output" in productOutput &&
                  recommendedIndex >= 0 &&
                  (productOutput.output as ProductListProps).products[recommendedIndex];

                return (
                  <>
                    {/* Render text before product list */}
                    {beforeProducts && (
                      <Streamdown key="text-before">{beforeProducts}</Streamdown>
                    )}

                    {/* Render product list */}
                    {productParts.map((part, index) => {
                      if (part.type === "tool-searchProducts") {
                        switch (part.state) {
                          case "input-available":
                            return <div key={index}>Searching for products...</div>;
                          case "output-available":
                            // Only show product list if there's a text part or if it's a user message
                            if (message.role === "user" || hasTextPart) {
                              return (
                                <div key={index}>
                                  <ProductList {...(part.output as ProductListProps)} />
                                </div>
                              );
                            }
                            return null;
                          case "output-error":
                            return <div key={index}>Error: {part.errorText}</div>;
                          default:
                            return null;
                        }
                      }
                      return null;
                    })}

                    {/* Render cart */}
                    {message.parts.map((part, index) => {
                      if (part.type === "tool-showCart") {
                        switch (part.state) {
                          case "input-available":
                            return <div key={index}>Loading your cart...</div>;
                          case "output-available":
                            return (
                              <div key={index}>
                                <CartSummary />
                              </div>
                            );
                          case "output-error":
                            return <div key={index}>Error loading cart: {part.errorText}</div>;
                          default:
                            return null;
                        }
                      }
                      return null;
                    })}

                    {/* Render text between product list and recommended product */}
                    {middleText && (
                      <Streamdown key="text-middle">{middleText}</Streamdown>
                    )}

                    {/* Render recommended product card */}
                    {recommendedProduct && (
                      <div key="recommended-product" className="my-4 flex justify-center">
                        <ProductCard product={recommendedProduct} />
                      </div>
                    )}

                    {/* Render text after recommended product */}
                    {afterRecommended && (
                      <Streamdown key="text-after">{afterRecommended}</Streamdown>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        ))}
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed form at the bottom */}
      <div className="sticky bottom-0 w-full bg-[#1e1a16] border-t border-zinc-800/50 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between gap-6 bg-[#28221d] p-3 border border-zinc-800 rounded-4xl focus-within:ring-2 focus-within:ring-zinc-500 text-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="De quoi as-tu envie aujourd'hui ?"
              className="outline-none w-full ml-1 bg-transparent"
            />
            <button
              type="submit"
              className="bg-[#d97757] text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <ArrowUp className="w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
