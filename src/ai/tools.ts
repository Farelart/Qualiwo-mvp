import { tool as createTool } from "ai";
import { z } from "zod";
import products from "@/data/data.json";

// Product type definition
export type Product = {
  name: string;
  categories: string[];
  brand: string;
  priceEuro: string;
  color: string;
  image: string;
  description: string;
};

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
  execute: async function ({ query, limit = 5 }) {
    // Simple search function - you can enhance this with more sophisticated search logic
    const searchResults = products
      .filter((product) => {
        const searchText = query.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchText) ||
          product.brand.toLowerCase().includes(searchText) ||
          product.categories.some((cat) =>
            cat.toLowerCase().includes(searchText)
          ) ||
          product.description.toLowerCase().includes(searchText) ||
          product.color.toLowerCase().includes(searchText)
        );
      })
      .slice(0, limit);

    return {
      query,
      products: searchResults,
      totalFound: searchResults.length,
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
