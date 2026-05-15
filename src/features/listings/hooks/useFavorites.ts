import { useStore } from "../../../store/StoreContext";
import toast from "react-hot-toast";
import type { ListingId } from "../types";

export const useFavorites = () => {
  const { state, dispatch } = useStore();

  const toggle = (id: ListingId, title: string) => {
    const isCurrentlySaved = state.saved.includes(id);
    dispatch({ type: "TOGGLE_FAVORITE", payload: id });

    if (isCurrentlySaved) {
      toast.error(`Removed: ${title}`);
    } else {
      toast.success(`Saved: ${title}`);
    }
  };

  const isSaved = (id: ListingId) => state.saved.includes(id);

  return {
    toggle,
    isSaved,
    count: state.saved.length,
  };
};
