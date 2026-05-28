export type ProductImageKey =
  | "serviceFacial"
  | "serviceFacialAlt"
  | "serviceLash"
  | "serviceLpg"
  | "serviceIpl"
  | "logo";

export type StoreProductRecord = {
  id: string;
  name: string;
  category: string;
  description: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  sessions?: number;
  featured?: boolean;
  popular?: boolean;
  giftable?: boolean;
  active?: boolean;
  sortOrder?: number;
  duration: string;
  idealFor: string;
  includes: string[];
  imageKey?: ProductImageKey;
  imageUrl?: string;
};
