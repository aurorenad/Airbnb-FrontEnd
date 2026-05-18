import api from "../../../lib/axios";
import type { Listing, ListingCategory, ListingId } from "../types";

type ApiListingType = "APARTMENT" | "HOUSE" | "VILLA" | "CABIN";

interface ApiListingPhoto {
  url: string;
}

interface ApiListing {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  guests: number;
  type: ApiListingType;
  amenities: string[];
  createdAt?: string;
  hostId?: string;
  status?: "ACTIVE" | "PENDING" | "EXPIRED";
  host?: {
    name?: string | null;
  };
  photos?: ApiListingPhoto[];
  _count?: {
    bookings?: number;
    reviews?: number;
  };
  reviews?: unknown[];
}

interface ListingsResponse {
  data: ApiListing[];
}

export interface CreateListingPayload {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  guests: number;
  type: ApiListingType;
  amenities: string[];
}

const CATEGORY_BY_TYPE: Record<ApiListingType, ListingCategory> = {
  APARTMENT: "apartment",
  HOUSE: "house",
  VILLA: "villa",
  CABIN: "cabin"
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=560&fit=crop",
  "https://images.unsplash.com/photo-1502672260066-6bc35f0a1f80?w=800&h=560&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=560&fit=crop",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=560&fit=crop",
];

const hashString = (value: string) =>
  value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

const getListingImage = (listing: ApiListing) =>
  listing.photos?.[0]?.url ?? FALLBACK_IMAGES[Math.abs(hashString(listing.id)) % FALLBACK_IMAGES.length];

export const mapApiListing = (listing: ApiListing): Listing => {
  const img = getListingImage(listing);
  const reviews =
    listing._count?.reviews ??
    (Array.isArray(listing.reviews) ? listing.reviews.length : listing._count?.bookings ?? 0);

  return {
    id: listing.id,
    title: listing.title,
    location: listing.location,
    price: listing.pricePerNight,
    rating: listing.rating ?? 4.5,
    reviews,
    featured: (listing.rating ?? 0) >= 4.7,
    verified: true,
    description: listing.description,
    phone: listing.host?.name ? `Host: ${listing.host.name}` : "Contact host after booking",
    img,
    images: listing.photos?.map((photo) => photo.url).filter(Boolean) ?? FALLBACK_IMAGES.filter((url) => url !== img),
    category: CATEGORY_BY_TYPE[listing.type] ?? "apartments",
    createdAt: listing.createdAt,
    guests: listing.guests,
    amenities: listing.amenities,
    hostId: listing.hostId,
    status: listing.status ?? "ACTIVE",
  };
};

export const fetchListings = async (): Promise<Listing[]> => {
  const { data } = await api.get<ListingsResponse>("/listings", {
    params: { limit: 100, sortBy: "createdAt", order: "desc" },
  });

  return data.data.map(mapApiListing);
};

export const fetchListingById = async (id: ListingId): Promise<Listing> => {
  const { data } = await api.get<ApiListing>(`/listings/${id}`);
  return mapApiListing(data);
};

export const createListing = async (payload: CreateListingPayload): Promise<Listing> => {
  const { data } = await api.post<ApiListing>("/listings", payload);
  return mapApiListing(data);
};

export const uploadListingPhotos = async (listingId: ListingId, files: File[]): Promise<Listing> => {
  const formData = new FormData();
  files.slice(0, 5).forEach((file) => formData.append("photos", file));

  const { data } = await api.post<ApiListing>(`/upload/listings/${listingId}/photos`, formData);

  return mapApiListing(data);
};

export const deleteListing = async (listingId: ListingId) => {
  await api.delete(`/listings/${listingId}`);
};

export const fetchAdminListings = async (status: string): Promise<Listing[]> => {
  const { data } = await api.get<ListingsResponse>("/listings/admin", {
    params: { status, limit: 100 },
  });
  return data.data.map(mapApiListing);
};
