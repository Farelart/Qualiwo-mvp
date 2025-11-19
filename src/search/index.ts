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

// 2. Inès Semantic Search (AI-powered with vector search) - ACTIVE
export { semanticSearch as searchProducts } from "./inèsSemanticSearch";