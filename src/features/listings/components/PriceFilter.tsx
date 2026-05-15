import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useStore } from "../../../store/StoreContext";
import type { SortOption } from "../../../store/types";
import type { ListingCategory } from "../types";
import numeral from "numeral";
import clsx from "clsx";

const MIN = 0;
const MAX = 1000;

const CATEGORIES: { value: ListingCategory; label: string }[] = [
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "latest", label: "Latest" },
    { value: "nearby", label: "Nearby" },
    { value: "a-z", label: "A-Z" },
    { value: "top-rated", label: "Top Rated" },
    { value: "random", label: "Random" },
];

const PriceFilter = () => {
    const { state, dispatch } = useStore();
    const [minVal, maxVal] = state.priceRange;

    // Local draft state — only applied on "Apply filters"
    const [draftMin, setDraftMin] = useState(minVal);
    const [draftMax, setDraftMax] = useState(maxVal);
    const [draftCategories, setDraftCategories] = useState<ListingCategory[]>(state.selectedCategories);
    const [draftSort, setDraftSort] = useState<SortOption>(state.sortBy);

    const minPercent = ((draftMin - MIN) / (MAX - MIN)) * 100;
    const maxPercent = ((draftMax - MIN) / (MAX - MIN)) * 100;

    const handleMinChange = (val: number) => {
        setDraftMin(Math.min(val, draftMax - 50));
    };

    const handleMaxChange = (val: number) => {
        setDraftMax(Math.max(val, draftMin + 50));
    };

    const toggleCategory = (cat: ListingCategory) => {
        setDraftCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const applyFilters = () => {
        dispatch({ type: "SET_PRICE_RANGE", payload: [draftMin, draftMax] });
        // Apply each category toggle relative to current store state
        dispatch({ type: "RESET" });
        dispatch({ type: "SET_PRICE_RANGE", payload: [draftMin, draftMax] });
        draftCategories.forEach((cat) => dispatch({ type: "TOGGLE_CATEGORY", payload: cat }));
        dispatch({ type: "SET_SORT_BY", payload: draftSort });
    };

    const clearFilters = () => {
        setDraftMin(0);
        setDraftMax(1000);
        setDraftCategories([]);
        setDraftSort("latest");
        dispatch({ type: "RESET" });
    };

    return (
        <div className="rounded-2xl border border-black/5 shadow-sm p-6" style={{ backgroundColor: "#f7f3ef" }}>

            {/* Price Filter */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Price Filter</h3>
                <p className="text-xs text-slate-400 mb-5">Select min and max price range</p>

                {/* Price labels */}
                <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-1 bg-rose-500 text-white text-xs font-bold rounded">
                        {numeral(draftMin).format("$0,0")}
                    </span>
                    <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded">
                        {numeral(draftMax).format("$0,0")}
                    </span>
                    <span className="text-xs text-slate-400">{numeral(MAX).format("$0,0")}</span>
                </div>

                {/* Dual range slider */}
                <div className="relative h-6 flex items-center">
                    <div className="absolute w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div
                        className="absolute h-1.5 bg-rose-500 rounded-full pointer-events-none"
                        style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                    />
                    <input
                        type="range" min={MIN} max={MAX} step={10} value={draftMin}
                        onChange={(e) => handleMinChange(Number(e.target.value))}
                        className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer range-thumb"
                        style={{ zIndex: draftMin > MAX - 100 ? 5 : 3 }}
                    />
                    <input
                        type="range" min={MIN} max={MAX} step={10} value={draftMax}
                        onChange={(e) => handleMaxChange(Number(e.target.value))}
                        className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer range-thumb"
                        style={{ zIndex: 4 }}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Categories</h3>
                <p className="text-xs text-slate-400 mb-4">Filter by property type</p>
                <div className="space-y-3">
                    {CATEGORIES.map(({ value, label }) => {
                        const checked = draftCategories.includes(value);
                        return (
                            <label key={value} className="flex items-center gap-3 cursor-pointer group">
                                <div
                                    onClick={() => toggleCategory(value)}
                                    className={clsx(
                                        "w-5 h-5 rounded flex items-center justify-center border-2 transition-colors shrink-0",
                                        checked
                                            ? "bg-rose-500 border-rose-500"
                                            : "border-slate-300 dark:border-slate-600 group-hover:border-rose-400"
                                    )}
                                >
                                    {checked && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium capitalize">
                                    {label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Order By */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Order by</h3>
                <p className="text-xs text-slate-400 mb-4">Sort your results</p>
                <div className="relative">
                    <select
                        value={draftSort}
                        onChange={(e) => setDraftSort(e.target.value as SortOption)}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium focus:outline-none focus:border-rose-400 transition-colors cursor-pointer"
                        style={{ backgroundColor: "#f7f3ef" }}
                    >
                        {SORT_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-5 space-y-3">
                <button
                    onClick={applyFilters}
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors active:scale-[0.98]"
                >
                    Apply filters
                </button>
                <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Clear filters
                </button>
            </div>
        </div>
    );
};

export default PriceFilter;
