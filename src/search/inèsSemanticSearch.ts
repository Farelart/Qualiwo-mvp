import { SearchFunction, SearchItem } from "./types";

/**
 * Inès Semantic Search - Calls the hybrid search API
 * API: http://34.155.84.157:8080
 * Uses LLM filter extraction + vector search
 */

interface ApiSearchRequest {
  query: string;
  use_vector_search?: boolean;
  limit?: number;
}

interface ApiSearchResponse {
  success: boolean;
  message: string;
  query: string;
  results_count: number;
  results: SearchItem[];
  filters_extracted?: Record<string, unknown> | null;
}

/**
 * Search items using Inès Semantic Search API
 * Handles products, food, and accommodations
 */
export const semanticSearch: SearchFunction = async ({ query, limit = 10 }) => {
  const API_URL = "http://34.155.84.157:8080/search";

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
        items: [],
        totalFound: 0,
      };
    }

    // Parse response
    const data: ApiSearchResponse = await response.json();

    // API already returns items in the correct format
    // Just return them directly
    return {
      query,
      items: data.results,
      totalFound: data.results_count,
    };
  } catch (error) {
    console.error("Error calling Inès Semantic Search API:", error);
    // Return empty results on error instead of throwing
    return {
      query,
      items: [],
      totalFound: 0,
    };
  }
};
