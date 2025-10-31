// Export types
export type { Product, SearchParams, SearchResult, SearchFunction } from "./types";

// Export the search function you want to use
// Switch between different implementations by changing the line below:

// 1. Simple filter search (current - fast, basic keyword matching)
/* export { simpleSearch as searchProducts } from "./simpleFilterSearch";
 */export { semanticSearch as searchProducts } from "./inèsSemanticSearch";
// 2. Inès Semantic Search (AI-powered with vector search)
// export { semanticSearch as searchProducts } from "./inèsSemanticSearch";