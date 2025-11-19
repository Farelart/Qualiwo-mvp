// Base item type
export type BaseItem = {
  id: string;
  type: "product" | "food" | "accommodation";
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  availability: {
    status: string;
  };
  meta: {
    source: string;
    rating: number | null;
    reviews_count: number | null;
  };
};

// Product type
export type Product = BaseItem & {
  type: "product";
  price: {
    amount: number;
    currency: string;
    display: string;
    amount_eur: number;
    currency_original: string;
  };
  image: string;
  attributes: {
    brand: string;
    color: string;
  };
  similarity_score?: number;
};

// Food type
export type Food = BaseItem & {
  type: "food";
  price: {
    amount: number;
    currency: string;
  };
  image: string;
  attributes: {
    spicy_level: string;
    ingredients: string[];
  };
};

// Accommodation type
export type Accommodation = BaseItem & {
  type: "accommodation";
  image?: string | null; // Single image field (can be null)
  location?: {
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  price: {
    amount: number;
    currency: string;
    display: string;
    perNight: number;
  };
  capacity?: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  images?: string[]; // Optional - API might not always provide images
  rating?: {
    score: number | null;
    reviewsCount: number;
  };
  attributes?: {
    roomType: string;
    spaceType: string;
    badges: string[];
    superhost: boolean;
  };
  meta: BaseItem["meta"] & {
    url?: string;
    locale?: string;
    originalId?: string;
  };
};

// Union type for all items
export type SearchItem = Product | Food | Accommodation;

export type SearchParams = {
  query: string;
  limit?: number;
};

export type SearchResult = {
  query: string;
  items: SearchItem[];
  totalFound: number;
};

export type SearchFunction = (params: SearchParams) => Promise<SearchResult>;

// Legacy Product type for backward compatibility (deprecated)
export type LegacyProduct = {
  name: string;
  categories: string[];
  brand: string;
  priceEuro: string;
  color: string;
  image: string;
  description: string;
};