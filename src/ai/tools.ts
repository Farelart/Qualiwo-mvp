import { tool as createTool } from "ai";
import { z } from "zod";
import { searchProducts } from "@/search";
import type { Product, SearchResult } from "@/search/types";

// Re-export Product type for backward compatibility
export type { Product };

export const productSearchTool = createTool({
  description:
    "Search for products based on user query. Use this when users ask about products, shopping, or want to find specific items. The tool returns a summary of products found so you can validate if they match what the user asked for.",
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
  execute: async ({ query, limit = 10 }): Promise<SearchResult & { productsSummary: string }> => {
    const result = await searchProducts({ query, limit });

    // Create a summary of products for the AI to analyze
    let productsSummary = "";
    if (result.items.length === 0) {
      productsSummary = `No products found for "${query}".`;
    } else {
      const products = result.items as Product[];
      const summaryLines = products.map((p, i) =>
        `${i + 1}. "${p.name}" - ${p.brand || 'Unknown brand'} - ${p.price.amount.toLocaleString()} ${p.price.currency} - Categories: ${p.categories?.join(', ') || 'N/A'}`
      );
      productsSummary = `Found ${result.totalFound} products for "${query}":\n${summaryLines.join('\n')}`;
    }

    return {
      ...result,
      productsSummary,
    };
  },
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
