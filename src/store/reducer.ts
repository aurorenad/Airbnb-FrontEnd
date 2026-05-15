import type { State, Action } from "./types";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LISTINGS":
      return { ...state, listings: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        saved: state.saved.includes(action.payload)
          ? state.saved.filter((id) => id !== action.payload)
          : [...state.saved, action.payload],
      };
    case "SET_PRICE_RANGE":
      return { ...state, priceRange: action.payload };
    case "TOGGLE_CATEGORY":
      return {
        ...state,
        selectedCategories: state.selectedCategories.includes(action.payload)
          ? state.selectedCategories.filter((cat) => cat !== action.payload)
          : [...state.selectedCategories, action.payload],
      };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "RESET":
      return {
        ...state,
        filter: "",
        saved: [],
        priceRange: [0, 1000],
        selectedCategories: [],
        sortBy: "latest",
      };
    default:
      return state;
  }
};
