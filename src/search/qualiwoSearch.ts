import { SearchFunction, Product } from "./types";

/**
 * Qualiwo Search API
 * API: https://qualiwo-search-api.vercel.app
 * Returns products from the Qualiwo product database
 */

interface QualiwoApiResponse {
  query: string;
  count: number;
  results: Product[];
}

/**
 * Search products using Qualiwo Search API
 */
export const qualiwoSearch: SearchFunction = async ({ query, limit = 10 }) => {
  const API_URL = "https://qualiwo-search-api.vercel.app/api/search";

  try {
    // Build URL with query parameters
    const url = new URL(API_URL);
    url.searchParams.set("q", query);
    if (limit) {
      url.searchParams.set("limit", limit.toString());
    }

    // Make API call
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if request was successful
    if (!response.ok) {
      console.error(`Qualiwo API request failed with status ${response.status}`);
      // Return empty results on error
      return {
        query,
        items: [],
        totalFound: 0,
      };
    }

    // Parse response
    const data: QualiwoApiResponse = await response.json();

    // Return results in the expected format
    return {
      query,
      items: data.results,
      totalFound: data.count,
    };
  } catch (error) {
    console.error("Error calling Qualiwo Search API:", error);
    return {
      query,
      items: [],
      totalFound: 0,
    };
  }
};

