import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { useListing } from "../hooks/useListing";
import {
  ChevronLeft, MapPin, Star, ShieldCheck, Heart,
  Grid2x2, X, ChevronRight, ChevronLeft as ChevLeft,
} from "lucide-react";
import numeral from "numeral";
import Spinner from "../../../shared/components/Spinner";
import { BookingForm } from "../../bookings";
import { useAuth } from "../../auth/hooks/useAuth";
import { createListingReview, fetchListingReviews } from "../../dashboard/api/reviewsApi";
import { fetchMyBookings } from "../../dashboard/api/bookingsApi";
import toast from "react-hot-toast";

const P = "#e8441a";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSaved, toggle } = useFavorites();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showBooking, setShowBooking] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const { data: listing, isLoading, isError } = useListing(id);
  const reviewsQuery = useQuery({
    queryKey: ["listing-reviews", id],
    queryFn: () => fetchListingReviews(id as string),
    enabled: !!id,
  });
  const reviewMutation = useMutation({
    mutationFn: () => createListingReview(id as string, reviewRating, reviewComment),
    onSuccess: async () => {
      setReviewComment("");
      setReviewRating(5);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["listing-reviews", id] }),
        queryClient.invalidateQueries({ queryKey: ["listing", id] }),
        queryClient.invalidateQueries({ queryKey: ["listings"] }),
      ]);
      toast.success("Review added");
    },
    onError: () => toast.error("Failed to add review"),
  });

  const myBookingsQuery = useQuery({
    queryKey: ["my-bookings"],
    queryFn: fetchMyBookings,
    enabled: !!user,
  });

  const hasConfirmedBooking = myBookingsQuery.data?.some(
    (b) => b.listing.id === listing?.id && b.status === "CONFIRMED"
  );

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><Spinner /></div>;
  if (isError || !listing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Listing not found</h2>
        <button onClick={() => navigate("/")} className="font-semibold hover:underline" style={{ color: P }}>
          Back to all listings
        </button>
      </div>
    );
  }

  const { title, location, price, rating, reviews, featured, verified, description, phone, img } = listing;
  const isOwnListing = !!user && listing.hostId === user.id;
  const allImages = [img, ...(listing.images ?? [])];

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevImg = () => setLightboxIdx(i => i !== null ? (i - 1 + allImages.length) % allImages.length : 0);
  const nextImg = () => setLightboxIdx(i => i !== null ? (i + 1) % allImages.length : 0);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-rose-500 transition-colors mb-6 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Go Back</span>
        </button>

        {/* Title row */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">{title}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-semibold" style={{ color: P }}>
                  ({rating}) {reviews.toLocaleString()} reviews
                </span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />{location}
              </span>
            </div>
          </div>
          <button
            onClick={() => toggle(listing.id, listing.title)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-rose-500 transition-colors shrink-0"
          >
            <Heart className={`w-5 h-5 ${isSaved(listing.id) ? "text-rose-500 fill-rose-500" : ""}`} />
            {isSaved(listing.id) ? "Saved" : "Save this listing"}
          </button>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-8 h-[420px] relative">
          <div className="relative cursor-pointer group" onClick={() => openLightbox(0)}>
            <img
              src={allImages[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:brightness-90 transition-all"
            />
            {featured && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg font-bold text-xs uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Featured
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="relative cursor-pointer group overflow-hidden"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={allImages[idx] ?? allImages[0]}
                  alt={`${title} ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:brightness-90 transition-all"
                />
                {idx === 3 && (
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-end p-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
                      className="flex items-center gap-1.5 bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-slate-50 transition-colors"
                    >
                      <Grid2x2 className="w-3.5 h-3.5" /> View photos
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-6 py-5 border-y border-slate-100">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-lg font-bold text-slate-900">{numeral(rating).format("0.0")}</span>
                <span className="text-slate-500 text-sm">({reviews.toLocaleString()} reviews)</span>
              </div>
              <div className="w-px h-6 bg-slate-100" />
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-5 h-5 ${verified ? "text-emerald-500" : "text-slate-400"}`} />
                <span className={`font-semibold ${verified ? "text-emerald-600" : "text-slate-500"}`}>
                  {verified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed">{description}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Contact</h2>
              <p className="text-slate-600">{phone}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Reviews</h2>
              {user && !isOwnListing && hasConfirmedBooking && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!reviewComment.trim()) return;
                    reviewMutation.mutate();
                  }}
                  className="mb-5 rounded-lg border border-slate-100 p-4"
                  style={{ backgroundColor: "#f7f3ef" }}
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button key={value} type="button" onClick={() => setReviewRating(value)} aria-label={`${value} stars`}>
                        <Star className={`w-5 h-5 ${value <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    rows={3}
                    placeholder="Share your stay experience"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <button
                    type="submit"
                    disabled={reviewMutation.isPending || !reviewComment.trim()}
                    className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                    style={{ backgroundColor: P }}
                  >
                    Submit Review
                  </button>
                </form>
              )}
              {reviewsQuery.isLoading && <p className="text-sm text-slate-500">Loading reviews...</p>}
              <div className="space-y-3">
                {(reviewsQuery.data ?? []).map((review) => (
                  <div key={review.id} className="rounded-lg border border-slate-100 p-4" style={{ backgroundColor: "#f7f3ef" }}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                          {review.user.avatar
                            ? <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                            : null}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{review.user.name}</p>
                          <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Star key={value} className={`w-3.5 h-3.5 ${value <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
              {!reviewsQuery.isLoading && (reviewsQuery.data ?? []).length === 0 && (
                <p className="text-sm text-slate-500">No reviews for this listing yet.</p>
              )}
            </div>
          </div>

          {/* Right — price + book */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4" style={{ backgroundColor: "#f7f3ef" }}>
              <div>
                <p className="text-slate-500 text-sm mb-1">Starting Price</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black" style={{ color: P }}>{numeral(price).format("$0,0")}</span>
                  <span className="text-slate-400 text-sm">/ night</span>
                </div>
              </div>
              {isOwnListing ? (
                <div className="w-full py-4 rounded-xl font-bold text-center text-slate-600 bg-slate-200">
                  You host this listing
                </div>
              ) : (
                <button
                  onClick={() => setShowBooking(true)}
                  className="w-full py-4 rounded-xl font-bold text-white text-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: P }}
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 p-2 text-white hover:text-slate-300 transition-colors">
            <X className="w-7 h-7" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-4 p-3 text-white hover:text-slate-300 transition-colors">
            <ChevLeft className="w-8 h-8" />
          </button>
          <img
            src={allImages[lightboxIdx]}
            alt={`${title} ${lightboxIdx + 1}`}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-4 p-3 text-white hover:text-slate-300 transition-colors">
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="absolute bottom-4 flex gap-2">
            {allImages.map((src, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === lightboxIdx ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium">
            {lightboxIdx + 1} / {allImages.length}
          </div>
        </div>
      )}

      {showBooking && !isOwnListing && (
        <BookingForm listingId={listing.id} onClose={() => setShowBooking(false)} />
      )}
    </>
  );
};

export default ListingDetail;