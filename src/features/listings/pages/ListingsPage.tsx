import { useMemo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import { useStore } from "../../../store/StoreContext";
import { useListings } from "../hooks/useListings";
import { useFavorites } from "../hooks/useFavorites";
import ListingCard from "../components/ListingCard";
import PriceFilter from "../components/PriceFilter";
import Spinner from "../../../shared/components/Spinner";
import { FaSearch } from "react-icons/fa";
import { AlertCircle } from "lucide-react";
import type { ListingId } from "../types";

// Stable seed computed once at module load — avoids Math.random() inside render
const SHUFFLE_SEED = Date.now();

const seededSort = (a: { id: ListingId }, b: { id: ListingId }) => {
  const hashA = String(a.id).split("").reduce((s, c) => s + c.charCodeAt(0), SHUFFLE_SEED);
  const hashB = String(b.id).split("").reduce((s, c) => s + c.charCodeAt(0), SHUFFLE_SEED);
  return hashA - hashB;
};

const ListingsPage = () => {
  const { state } = useStore();
  const { listings, filter, priceRange, selectedCategories, sortBy } = state;
  const { isSaved, toggle } = useFavorites();

  const { isLoading, isError, refetch } = useListings();

  const handleToggleSave = useCallback(
    (id: ListingId, title: string) => toggle(id, title),
    [toggle]
  );

  const filteredListings = useMemo(() => {
    const [minPrice, maxPrice] = priceRange;
    let result = listings.filter((listing) => {
      const matchesSearch = `${listing.title} ${listing.location}`
        .toLowerCase()
        .includes(filter.toLowerCase());
      const matchesPrice = listing.price >= minPrice && listing.price <= maxPrice;
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(listing.category);
      return matchesSearch && matchesPrice && matchesCategory;
    });
    switch (sortBy) {
      case "a-z":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "top-rated":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "latest":
        result = [...result].sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
        break;
      case "random":
        // Uses a stable module-level seed — safe inside useMemo
        result = [...result].sort(seededSort);
        break;
    }
    return result;
  }, [listings, filter, priceRange, selectedCategories, sortBy]);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const listing = filteredListings[index];
      return (
        <div style={style} className="px-2">
          <ListingCard
            listing={listing}
            saved={isSaved(listing.id)}
            onToggleSave={() => handleToggleSave(listing.id, listing.title)}
          />
        </div>
      );
    },
    [filteredListings, isSaved, handleToggleSave]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner />
        <p className="mt-4 text-slate-500 animate-pulse">Loading amazing places...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <p className="text-slate-600 font-medium">Failed to load listings.</p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#e8441a" }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6 items-start">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
          <PriceFilter />
        </aside>

        <div className="flex-1 flex flex-col gap-6">
          <div className="lg:hidden">
            <PriceFilter />
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-slate-500">
              All{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredListings.length}
              </span>{" "}
              listing{filteredListings.length !== 1 ? "s" : ""} found
              {filter && (
                <span>
                  {" "}for "<span className="font-semibold italic">{filter}</span>"
                </span>
              )}
            </p>
          </div>

          {filteredListings.length > 0 ? (
            <List
              height={800}
              itemCount={filteredListings.length}
              itemSize={180}
              width="100%"
              className="scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
            >
              {Row}
            </List>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                No listings found
              </h3>
              <p className="text-slate-500 max-w-xs">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;