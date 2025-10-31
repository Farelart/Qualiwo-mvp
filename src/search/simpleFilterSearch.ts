import products from "@/data/data.json";
import { SearchFunction } from "./types";

export const simpleSearch: SearchFunction = async ({ query, limit = 5 }) => {
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
};