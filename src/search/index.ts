// Export types
export type {
  Product,
  Food,
  Accommodation,
  SearchItem,
  SearchParams,
  SearchResult,
  SearchFunction
} from "./types";

// Export the search function you want to use
// Switch between different implementations by changing the line below:

// 1. Simple filter search (fast, basic keyword matching)
// export { simpleSearch as searchProducts } from "./simpleFilterSearch";

// 2. Inès Semantic Search (AI-powered with vector search)
// export { semanticSearch as searchProducts } from "./inèsSemanticSearch";

// 3. Qualiwo Search API (external API with rich product data) - ACTIVE
export { qualiwoSearch as searchProducts } from "./qualiwoSearch";