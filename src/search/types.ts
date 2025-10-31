export type Product = {
  name: string;
  categories: string[];
  brand: string;
  priceEuro: string;
  color: string;
  image: string;
  description: string;
};

export type SearchParams = {
  query: string;
  limit?: number;
};

export type SearchResult = {
  query: string;
  products: Product[];
  totalFound: number;
};

export type SearchFunction = (params: SearchParams) => Promise<SearchResult>;