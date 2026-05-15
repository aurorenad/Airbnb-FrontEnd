import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useStore } from "../../../store/StoreContext";
import { fetchListings } from "../api/listingsApi";

export const useListings = () => {
  const { dispatch } = useStore();

  const query = useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (!query.data) return;
    dispatch({ type: "SET_LISTINGS", payload: query.data });
    dispatch({ type: "SET_LOADING", payload: false });
  }, [query.data, dispatch]);

  return query;
};
