import { useState } from "react";
import { useStore } from "../../../store/StoreContext";
import { Link } from "react-router-dom";
import { Star, MapPin, Phone, Edit, Trash2, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useListings } from "../../listings/hooks/useListings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteListing } from "../../listings/api/listingsApi";

const P = "#e8441a";
const BG = "#f7f3ef";

const TABS = ["Active", "Pending", "Expired"] as const;
type Tab = typeof TABS[number];

const MyListingPage = () => {
    const { state } = useStore();
    const { user, isAdmin } = useAuth();
    const queryClient = useQueryClient();
    const { isLoading, isError } = useListings();
    const [tab, setTab] = useState<Tab>("Active");
    const myListings = isAdmin ? state.listings : state.listings.filter(l => l.hostId === user?.id);
    const deleteMutation = useMutation({
        mutationFn: deleteListing,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["listings"] });
            toast.success("Listing deleted");
        },
        onError: () => toast.error("Failed to delete listing"),
    });

    const listingsByTab: Record<Tab, typeof state.listings> = {
        Active: myListings,
        Pending: [],
        Expired: [],
    };

    const items = listingsByTab[tab];

    return (
        <div className="max-w-4xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm font-light italic mb-0.5" style={{ color: P }}>My Listings</p>
                    <h1 className="text-2xl font-bold text-slate-900">{isAdmin ? "All Listings" : "Active Listings"}</h1>
                    <p className="text-slate-400 text-sm">
                        Discover exciting categories.{" "}
                        <span style={{ color: P }}>Find what you're looking for.</span>
                    </p>
                </div>
                <Link to="/listings" className="flex items-center gap-1 text-sm font-semibold" style={{ color: P }}>
                    SEE ALL <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-black/10">
                {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t ? "border-current" : "border-transparent text-slate-400 hover:text-slate-700"
                            }`}
                        style={tab === t ? { color: P, borderColor: P } : {}}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Listings */}
            {isLoading ? (
                <div className="py-20 text-center text-sm text-slate-500">Loading your listings...</div>
            ) : isError ? (
                <div className="py-20 text-center text-sm text-rose-500">Failed to load your listings.</div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-black/5" style={{ backgroundColor: BG }}>
                    <p className="text-slate-400 text-sm">No {tab.toLowerCase()} listings.</p>
                    <Link to="/add-listing" className="mt-3 text-sm font-semibold px-4 py-2 rounded-full text-white" style={{ backgroundColor: P }}>
                        Add a Listing
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map(listing => (
                        <div key={listing.id}
                            className="flex items-center gap-4 rounded-2xl border border-black/5 shadow-sm p-3"
                            style={{ backgroundColor: BG }}>
                            <Link to={`/listings/${listing.id}`} className="shrink-0">
                                <img src={listing.img} alt={listing.title}
                                    className="w-24 h-20 rounded-xl object-cover" />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 text-xs mb-1" style={{ color: P }}>
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>({listing.rating})</span>
                                    <span className="text-slate-400">{listing.reviews.toLocaleString()} reviews</span>
                                </div>
                                <Link to={`/listings/${listing.id}`}>
                                    <h3 className="font-semibold text-slate-900 hover:text-orange-500 transition-colors flex items-center gap-1">
                                        {listing.title}
                                        {listing.verified && <span className="text-green-500 text-xs">✓</span>}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.location}</span>
                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{listing.phone}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button className="p-2 rounded-lg hover:bg-black/5 transition-colors text-slate-400 hover:text-slate-700">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(listing.id)}
                                    disabled={deleteMutation.isPending}
                                    className="p-2 rounded-lg hover:bg-rose-50 transition-colors text-slate-400 hover:text-rose-500 disabled:opacity-40"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListingPage;
