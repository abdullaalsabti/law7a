export type Language = "en" | "ar";

export interface TranslatedText {
  en: string;
  ar: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isArtist: boolean;
  profilePicture?: string;
}

export interface Artist {
  id: string;
  userId: string;
  name: TranslatedText;
  bio: TranslatedText;
  profilePicture: string;
  coverImage?: string;
  location: TranslatedText;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
  tags: string[];
  featured: boolean;
}

export type ProductCategory =
  | "painting"
  | "pottery"
  | "calligraphy"
  | "digital"
  | "sculpture"
  | "jewelry"
  | "photography"
  | "textile"
  | "other";

export type ProductMedium =
  | "oil"
  | "acrylic"
  | "watercolor"
  | "mixed_media"
  | "ceramic"
  | "wood"
  | "metal"
  | "digital"
  | "clay"
  | "glass"
  | "fabric"
  | "paper"
  | "other";

export interface Product {
  id: string;
  artistId: string;
  title: TranslatedText;
  description: TranslatedText;
  price: number;
  currency: "JOD" | "USD";
  images: string[];
  category: ProductCategory;
  medium: ProductMedium;
  dimensions?: {
    width: number;
    height: number;
    depth?: number;
    unit: "cm" | "in";
  };
  weight?: {
    value: number;
    unit: "kg" | "g" | "lb" | "oz";
  };
  inStock: boolean;
  quantity?: number;
  featured: boolean;
  dateCreated: string;
  dateAdded: string;
  tags: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface SearchFilters {
  category?: ProductCategory[];
  artistId?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  medium?: ProductMedium[];
  searchQuery?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isArtist: boolean;
}
