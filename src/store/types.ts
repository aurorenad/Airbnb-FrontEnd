import type { Listing, ListingCategory, ListingId } from "../features/listings/types";

export type SortOption = "latest" | "nearby" | "a-z" | "top-rated" | "random";

export interface State {
  listings: Listing[];
  loading: boolean;
  filter: string;
  saved: ListingId[];
  priceRange: [number, number];
  selectedCategories: ListingCategory[];
  sortBy: SortOption;
}

export type Action =
  | { type: "SET_LISTINGS"; payload: Listing[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_FILTER"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: ListingId }
  | { type: "SET_PRICE_RANGE"; payload: [number, number] }
  | { type: "TOGGLE_CATEGORY"; payload: ListingCategory }
  | { type: "SET_SORT_BY"; payload: SortOption }
  | { type: "RESET" };
