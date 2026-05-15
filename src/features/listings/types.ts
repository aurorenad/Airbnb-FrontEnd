export type ListingCategory = 'house' | 'apartment' | 'villa' | 'cabin';
export type ListingId = string | number;

export interface Listing {
  id: ListingId;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  featured: boolean;
  verified: boolean;
  discount?: string;
  description: string;
  phone: string;
  img: string;
  images?: string[]; // additional gallery images
  category: ListingCategory;
  createdAt?: string;
  guests?: number;
  amenities?: string[];
  hostId?: string;
}
