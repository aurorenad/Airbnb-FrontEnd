import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Listing, ListingId } from "../types";
import { fetchListingById } from "../api/listingsApi";

export const useListing = (id: ListingId | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["listing", id],
    enabled: !!id,
    staleTime: 1000 * 60,
    queryFn: async (): Promise<Listing> => {
      if (!id) throw new Error("Listing id is required");

      const cached = queryClient.getQueryData<Listing[]>(["listings"]);
      if (Array.isArray(cached)) {
        const found = cached.find((listing) => listing.id === id);
        if (found) return found;
      }

      return fetchListingById(id);
    },
  });
};
