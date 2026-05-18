import { useState } from "react";
import { useStore } from "../../../store/StoreContext";
import { Link, Navigate } from "react-router-dom";
import {
  Star, MapPin, Phone, Trash2, ShieldCheck,
  ChevronDown, ChevronUp, MessageSquare, Users, Loader2,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useListings } from "../../listings/hooks/useListings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteListing, fetchAdminListings } from "../../listings/api/listingsApi";
import type { ListingId } from "../../listings/types";
import api from "../../../lib/axios";

const P = "#e8441a";
const BG = "#f7f3ef";

const TABS = ["Active", "Pending", "Expired"] as const;
type Tab = (typeof TABS)[number];

/* ── Stars component ── */
const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
          }`}
      />
    ))}
  </div>
);

/* ── Fetch listing detail (includes bookings + reviews) ── */
const fetchListingDetail = async (id: ListingId) => {
  const { data } = await api.get(`/listings/${id.toString()}`);
  return data;
};

const MyListingPage = () => {
  const { state } = useStore();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { isLoading, isError } = useListings();
  const [tab, setTab] = useState<Tab>("Active");
  const [expandedId, setExpandedId] = useState<ListingId | null>(null);

  const { data: adminListings = [], isLoading: isAdminLoading, isError: isAdminError } = useQuery({
    queryKey: ["admin-listings", tab],
    queryFn: () => fetchAdminListings(tab.toUpperCase()),
    enabled: isAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
      if (isAdmin) {
        await queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      }
      toast.success("Listing deleted");
    },
    onError: () => toast.error("Failed to delete listing"),
  });

  if (!isAdmin && user?.role !== "HOST") {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin sees fetched listings based on tab; host sees only their own active listings from state
  const myListings = state.listings.filter((l) => l.hostId === user?.id);

  // Only admin can delete any listing; host can only delete their own
  const canDelete = (hostId?: string) => isAdmin || hostId === user?.id;

  const listingsByTab: Record<Tab, typeof state.listings> = {
    Active: isAdmin ? adminListings : myListings,
    Pending: isAdmin ? adminListings : [],
    Expired: isAdmin ? adminListings : [],
  };

  const items = listingsByTab[tab];
  const currentIsLoading = isAdmin ? isAdminLoading : isLoading;
  const currentIsError = isAdmin ? isAdminError : isError;

  const toggleExpand = (id: ListingId) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-light italic mb-0.5" style={{ color: P }}>
            {isAdmin ? "Admin" : "My Listings"}
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAdmin ? "All Platform Listings" : "Active Listings"}
          </h1>
          <p className="text-slate-400 text-sm">
            {isAdmin ? (
              <span>
                Click on a listing to view{" "}
                <span style={{ color: P }}>bookings & reviews</span>. You can
                also <span style={{ color: P }}>message the owner</span>.
              </span>
            ) : (
              <>
                Discover exciting categories.{" "}
                <span style={{ color: P }}>Find what you're looking for.</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Hosts get an Add Listing shortcut — admins do not */}
          {!isAdmin && (
            <Link
              to="/add-listing"
              className="text-xs font-semibold px-3 py-1.5 rounded-full text-white"
              style={{ backgroundColor: P }}
            >
              + Add Listing
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-black/10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t
                ? "border-current"
                : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            style={tab === t ? { color: P, borderColor: P } : {}}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Count badge */}
      <p className="text-xs text-slate-500 mb-4">
        {items.length} listing{items.length !== 1 ? "s" : ""} found
      </p>

      {/* Content */}
      {currentIsLoading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          Loading listings…
        </div>
      ) : currentIsError ? (
        <div className="py-20 text-center text-sm text-rose-500">
          Failed to load listings.
        </div>
      ) : items.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-black/5"
          style={{ backgroundColor: BG }}
        >
          <p className="text-slate-400 text-sm">
            No {tab.toLowerCase()} listings.
          </p>
          {!isAdmin && (
            <Link
              to="/add-listing"
              className="mt-3 text-sm font-semibold px-4 py-2 rounded-full text-white"
              style={{ backgroundColor: P }}
            >
              Add a Listing
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((listing) => (
            <div key={listing.id}>
              {/* Listing card */}
              <div
                className={`flex items-center gap-4 rounded-2xl border shadow-sm p-3 cursor-pointer transition-all hover:border-orange-200 ${expandedId === listing.id
                    ? "border-orange-300 ring-1 ring-orange-200"
                    : "border-black/5"
                  }`}
                style={{ backgroundColor: BG }}
                onClick={() => toggleExpand(listing.id)}
              >
                <Link
                  to={`/listings/${listing.id}`}
                  className="shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={listing.img}
                    alt={listing.title}
                    className="w-24 h-20 rounded-xl object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div
                    className="flex items-center gap-1 text-xs mb-1"
                    style={{ color: P }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>({listing.rating})</span>
                    <span className="text-slate-400">
                      {listing.reviews.toLocaleString()} reviews
                    </span>
                  </div>
                  <Link
                    to={`/listings/${listing.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="font-semibold text-slate-900 hover:text-orange-500 transition-colors flex items-center gap-1">
                      {listing.title}
                      {listing.verified && (
                        <span className="text-green-500 text-xs">✓</span>
                      )}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {listing.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {listing.phone}
                    </span>
                    {/* Show host badge on admin view */}
                    {isAdmin && listing.hostId && (
                      <span className="flex items-center gap-1 text-indigo-400">
                        <ShieldCheck className="w-3 h-3" /> Host:{" "}
                        {listing.hostId.slice(0, 8)}…
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Message owner (admin only) */}
                  {isAdmin && listing.hostId && (
                    <Link
                      to={`/dashboard/messages?user=${listing.hostId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-slate-400 hover:text-blue-500"
                      title="Message owner"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                  )}
                  {/* Delete: admin can delete any; host can only delete their own */}
                  {canDelete(listing.hostId) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!confirm(`Delete "${listing.title}"?`)) return;
                        deleteMutation.mutate(listing.id);
                      }}
                      disabled={deleteMutation.isPending}
                      className="p-2 rounded-lg hover:bg-rose-50 transition-colors text-slate-400 hover:text-rose-500 disabled:opacity-40"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {/* Expand/collapse indicator */}
                  {expandedId === listing.id ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expandable detail panel */}
              {expandedId === listing.id && (
                <ListingDetailPanel listingId={listing.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Expandable listing detail panel ── */
interface ListingDetailPanelProps {
  listingId: ListingId;
}

const ListingDetailPanel = ({ listingId }: ListingDetailPanelProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["listing-detail", listingId],
    queryFn: () => fetchListingDetail(listingId),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div
        className="mt-1 rounded-2xl border border-orange-100 p-6 flex items-center justify-center gap-2 text-sm text-slate-500"
        style={{ backgroundColor: "#fff" }}
      >
        <Loader2 className="w-4 h-4 animate-spin" /> Loading details…
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        className="mt-1 rounded-2xl border border-orange-100 p-6 text-sm text-rose-500"
        style={{ backgroundColor: "#fff" }}
      >
        Failed to load listing details.
      </div>
    );
  }

  type ListingBooking = { status: "PENDING" | "CONFIRMED" | "CANCELLED" };
  type ListingReview = {
    id: string;
    rating?: number;
    comment?: string;
    createdAt?: string;
    user?: { avatar?: string; name?: string };
  };

  const bookings = (data.bookings ?? []) as ListingBooking[];
  const reviews = (data.reviews ?? []) as ListingReview[];
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");

  return (
    <div
      className="mt-1 rounded-2xl border border-orange-100 overflow-hidden animate-in slide-in-from-top-2 duration-200"
      style={{ backgroundColor: "#fff" }}
    >
      {/* Stats bar */}
      <div className="flex items-center gap-6 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {bookings.length}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              Total Bookings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {confirmedBookings.length}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              Confirmed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {pendingBookings.length}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              Pending
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <Star className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {reviews.length}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="px-6 py-4">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          Reviews ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <p className="text-sm text-slate-400 italic">
            No reviews for this listing yet.
          </p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">
                  {review.user?.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    review.user?.name?.charAt(0)?.toUpperCase() ?? "U"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-slate-800">
                      {review.user?.name ?? "Anonymous"}
                    </span>
                    <Stars rating={review.rating ?? 0} />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {review.comment}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }) : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingPage;