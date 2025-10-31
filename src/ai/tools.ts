import { tool as createTool } from "ai";
import { z } from "zod";
import { searchProducts } from "@/search";
import type { Product } from "@/search/types";

// Re-export Product type for backward compatibility
export type { Product };

export const productSearchTool = createTool({
  description:
    "Search for products based on user query. Use this when users ask about products, shopping, or want to find specific items.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The search query from the user (e.g., 'iPhone', 'laptop', 'headphones', 'phone under 100')"
      ),
    limit: z
      .number()
      .optional()
      .describe("Maximum number of products to return (default: 5)"),
  }),
  execute: searchProducts,
});

export const showCartTool = createTool({
  description:
    "Show the user's shopping cart. Use this when users ask to see their cart, want to checkout, or want to proceed to payment.",
  inputSchema: z.object({
    action: z
      .string()
      .optional()
      .describe("Optional action context (e.g., 'checkout', 'view', 'payment')"),
  }),
  execute: async function ({ action = "view" }) {
    // This tool just signals to show the cart component
    // The actual cart data comes from the Zustand store on the client side
    return {
      action,
      showCart: true,
    };
  },
});

export const tools = {
  searchProducts: productSearchTool,
  showCart: showCartTool,
};
