import { SearchFunction, Product } from "./types";

/**
 * Inès Semantic Search - Calls the hybrid search API
 * API: http://34.155.41.241:8080
 * Uses LLM filter extraction + vector search
 */

interface ApiSearchRequest {
  query: string;
  use_vector_search?: boolean;
  limit?: number;
}

interface ApiProductResponse {
  name: string;
  brand?: string | null;
  priceEuro?: number | null;
  categories?: string[] | null;
  description?: string | null;
  color?: string | null;
  image?: string | null;
  similarity_score?: number | null;
}

interface ApiSearchResponse {
  success: boolean;
  message: string;
  query: string;
  results_count: number;
  results: ApiProductResponse[];
  filters_extracted?: Record<string, unknown> | null;
}

/**
 * Placeholder image for products without images
 */
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

/**
 * Transform API product to match our Product type
 */
const transformApiProduct = (apiProduct: ApiProductResponse): Product => {
  return {
    name: apiProduct.name,
    brand: apiProduct.brand || "Unknown",
    priceEuro: apiProduct.priceEuro?.toString() || "0",
    categories: apiProduct.categories || [],
    description: apiProduct.description || "",
    color: apiProduct.color || "",
    image: apiProduct.image && apiProduct.image.trim() !== ""
      ? apiProduct.image
      : PLACEHOLDER_IMAGE,
  };
};

/**
 * Search products using Inès Semantic Search API
 * Matches the SearchFunction interface from types.ts
 */
export const semanticSearch: SearchFunction = async ({ query, limit = 5 }) => {
  const API_URL = "http://34.155.41.241:8080/search";

  try {
    // Prepare request body
    const requestBody: ApiSearchRequest = {
      query: query,
      use_vector_search: true,
      limit: limit,
    };

    // Make API call
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Check if request was successful
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      // Return empty results on error
      return {
        query,
        products: [],
        totalFound: 0,
      };
    }

    // Parse response
    const data: ApiSearchResponse = await response.json();

    // Transform API products to match our Product type
    const transformedProducts = data.results.map(transformApiProduct);

    // Return in the same format as simpleFilterSearch
    return {
      query,
      products: transformedProducts,
      totalFound: data.results_count,
    };
  } catch (error) {
    console.error("Error calling Inès Semantic Search API:", error);
    // Return empty results on error instead of throwing
    return {
      query,
      products: [],
      totalFound: 0,
    };
  }
};
