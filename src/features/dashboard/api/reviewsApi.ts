import api from "../../../lib/axios";

export interface ReviewUser {
  id: string;
  name: string;
  email?: string;
  avatar: string | null;
}

export interface ListingReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
  listing: {
    id: string;
    title: string;
    location: string;
  };
}

export interface SystemReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
}

export const fetchAllReviews = async () => {
  const { data } = await api.get<{ data: ListingReview[] }>("/reviews");
  return data.data;
};

export const fetchListingReviews = async (listingId: string | number) => {
  const { data } = await api.get<{ data: Omit<ListingReview, "listing">[] }>(`/reviews/listings/${listingId}/reviews`, {
    params: { limit: 100 },
  });
  return data.data;
};

export const createListingReview = async (listingId: string | number, rating: number, comment: string) => {
  const { data } = await api.post(`/reviews/listings/${listingId}/reviews`, { rating, comment });
  return data;
};

export const fetchSystemReviews = async () => {
  const { data } = await api.get<{ data: SystemReview[] }>("/reviews/system");
  return data.data;
};

export const createSystemReview = async (rating: number, comment: string) => {
  const { data } = await api.post<SystemReview>("/reviews/system", { rating, comment });
  return data;
};
