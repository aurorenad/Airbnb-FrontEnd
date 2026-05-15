import { createContext, useContext, useReducer } from "react";
import type { ReactNode, Dispatch } from "react";
import type { State, Action } from "./types";
import { reducer } from "./reducer";

const initialState: State = {
  listings: [],
  loading: true,
  filter: "",
  saved: [],
  priceRange: [0, 1000],
  selectedCategories: [],
  sortBy: "latest",
};

interface ContextProps {
  state: State;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<ContextProps | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
