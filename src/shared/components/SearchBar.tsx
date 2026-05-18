import { useEffect, useRef, useMemo } from "react";
import { MapPin, Locate, Grid, ChevronDown } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import debounce from "lodash/debounce";
import type { ListingCategory } from "../../features/listings/types";

const CATEGORIES: { value: ListingCategory | ""; label: string }[] = [
  { value: "",          label: "All Categories" },
  { value: "apartment", label: "Apartments" },
  { value: "house",     label: "Houses" },
  { value: "villa",     label: "Villas" },
  { value: "cabin",     label: "Cabins" },
];

const SearchBar = () => {
  const { state, dispatch } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const debouncedSetFilter = useMemo(
    () =>
      debounce((value: string) => {
        dispatch({ type: "SET_FILTER", payload: value });
      }, 300),
    [dispatch]
  );

  const handleCategoryChange = (category: string) => {
    state.selectedCategories.forEach((cat) => {
      dispatch({ type: "TOGGLE_CATEGORY", payload: cat });
    });
    if (category) {
      dispatch({ type: "TOGGLE_CATEGORY", payload: category as ListingCategory });
    }
  };

  const selectedCategory =
    state.selectedCategories.length === 1 ? state.selectedCategories[0] : "";

  return (
    <div
      className="sticky top-16 z-40 border-b border-black/10 dark:border-slate-800 dark:bg-slate-950"
      style={{ backgroundColor: "#f7f3ef" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center h-14 divide-x divide-slate-200 dark:divide-slate-800">
          {/* Search input */}
          <div className="flex-1 flex items-center gap-3 pr-6">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              defaultValue={state.filter}
              onChange={(e) => debouncedSetFilter(e.target.value)}
              placeholder="What are you looking for?"
              className="bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400 w-full text-sm"
            />
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xs text-slate-500">0.5 km</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <button className="p-1 hover:bg-black/5 rounded-full transition-colors shrink-0">
              <Locate className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Location */}
          <div className="flex-1 flex items-center justify-between gap-3 px-6 cursor-pointer hover:bg-black/5 transition-colors h-full">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-500">Select Location</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </div>

          {/* Category */}
          <div className="flex-1 flex items-center justify-between gap-3 pl-6 h-full">
            <div className="flex items-center gap-2 flex-1">
              <Grid className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm text-slate-500 cursor-pointer w-full appearance-none"
              >
                {CATEGORIES.map(({ value, label }) => (
                  <option key={value || "all"} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;