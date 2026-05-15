import { useState } from "react";
import { useStore } from "../../../store/StoreContext";
import { Link } from "react-router-dom";
import { Star, MapPin, Heart, Phone, CalendarCheck } from "lucide-react";
import { BookingForm } from "../../bookings";
import type { ListingId } from "../../listings/types";

const P = "#e8441a";
const BG = "#f7f3ef";

const BookmarkPage = () => {
    const { state, dispatch } = useStore();
    const [bookingListingId, setBookingListingId] = useState<ListingId | null>(null);

    const savedListings = state.listings.filter(l => state.saved.includes(l.id));
    const remove = (id: ListingId) => dispatch({ type: "TOGGLE_FAVORITE", payload: id });

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: P }} />
                <h1 className="text-2xl font-bold text-slate-900">Bookmarks</h1>
                <span className="ml-2 text-sm text-slate-400">({savedListings.length} saved)</span>
            </div>

            {savedListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-black/5" style={{ backgroundColor: BG }}>
                    <Heart className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="font-semibold text-slate-700 mb-1">No bookmarks yet</h3>
                    <p className="text-slate-400 text-sm mb-4">Save listings you love and they'll appear here.</p>
                    <Link to="/listings" className="text-white text-sm font-semibold px-5 py-2 rounded-full" style={{ backgroundColor: P }}>
                        Browse Listings
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {savedListings.map(listing => (
                        <div key={listing.id} className="flex gap-4 rounded-2xl border border-black/5 shadow-sm overflow-hidden" style={{ backgroundColor: BG }}>
                            <Link to={`/listings/${listing.id}`} className="shrink-0">
                                <img src={listing.img} alt={listing.title} className="w-40 h-32 object-cover" />
                            </Link>

                            <div className="flex-1 py-3 min-w-0 flex flex-col justify-between">
                                <div>
                                    {listing.featured && (
                                        <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded mr-2" style={{ backgroundColor: P }}>Featured</span>
                                    )}
                                    <div className="flex items-center gap-1 text-xs mt-1 mb-1" style={{ color: P }}>
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>{listing.rating}</span>
                                        <span className="text-slate-400">({listing.reviews.toLocaleString()} reviews)</span>
                                    </div>
                                    <Link to={`/listings/${listing.id}`}>
                                        <h3 className="font-semibold text-slate-900 hover:text-orange-500 transition-colors">
                                            {listing.title}
                                            {listing.verified && <span className="ml-1 text-green-500 text-xs">✓</span>}
                                        </h3>
                                    </Link>
                                    <p className="text-slate-500 text-xs mt-1 line-clamp-1">{listing.description}</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.location}</span>
                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{listing.phone}</span>
                                    <span className="font-semibold text-slate-700">${listing.price}/night</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col items-center justify-center gap-2 pr-4 shrink-0">
                                {/* Book Now button */}
                                <button
                                    onClick={() => setBookingListingId(listing.id)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-2 rounded-xl hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: P }}
                                >
                                    <CalendarCheck className="w-3.5 h-3.5" /> Book Now
                                </button>
                                {/* Remove bookmark */}
                                <button
                                    onClick={() => remove(listing.id)}
                                    className="p-2 rounded-full hover:bg-rose-50 transition-colors group"
                                    title="Remove bookmark"
                                >
                                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking modal */}
            {bookingListingId !== null && (
                <BookingForm
                    listingId={bookingListingId}
                    onClose={() => setBookingListingId(null)}
                />
            )}
        </div>
    );
};

export default BookmarkPage;
