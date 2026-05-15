import { Transition } from "@headlessui/react";
import { X, MapPin, Heart } from "lucide-react";
import { useStore } from "../../../store/StoreContext";
import { useFavorites } from "../hooks/useFavorites";
import numeral from "numeral";

interface SavedListingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavedListings = ({ isOpen, onClose }: SavedListingsProps) => {
  const { state } = useStore();
  const { toggle } = useFavorites();

  const savedListings = state.listings.filter((l) => state.saved.includes(l.id));

  return (
    <>
      {/* Backdrop */}
      <Transition show={isOpen}>
        <div
          className="fixed inset-0 z-[59] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 data-[closed]:opacity-0"
          onClick={onClose}
        />
      </Transition>

      {/* Drawer */}
      <Transition show={isOpen}>
        <div className="fixed inset-y-0 right-0 z-[60] flex max-w-full pl-10 transition-transform duration-500 data-[closed]:translate-x-full">
          <div className="w-screen max-w-md h-full flex flex-col dark:bg-slate-950 shadow-2xl" style={{ backgroundColor: "#f7f3ef" }}>
            {/* Header */}
            <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-lg">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved Places</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {savedListings.length > 0 ? (
                <div className="space-y-6">
                  {savedListings.map((listing) => (
                    <div key={listing.id} className="flex gap-4 group">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                        <img
                          src={listing.img}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                            {listing.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{listing.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-rose-500">
                            {numeral(listing.price).format("$0,0")}
                          </span>
                          <button
                            onClick={() => toggle(listing.id, listing.title)}
                            className="text-xs font-semibold text-rose-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Heart className="w-12 h-12 mb-4 text-slate-200" />
                  <p className="text-slate-500 font-medium">Your wishlist is empty</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-6 border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900/50" style={{ backgroundColor: "#ede8e3" }}>
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default SavedListings;
