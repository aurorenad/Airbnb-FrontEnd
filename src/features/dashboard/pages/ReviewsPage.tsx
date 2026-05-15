import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { createSystemReview, fetchAllReviews, fetchSystemReviews } from "../api/reviewsApi";
import { useAuth } from "../../auth/hooks/useAuth";

const P = "#e8441a";
const BG = "#f7f3ef";

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`w-4 h-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
    ))}
  </div>
);

const ReviewsPage = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const listingReviewsQuery = useQuery({ queryKey: ["admin-reviews"], queryFn: fetchAllReviews, enabled: isAdmin });
  const systemReviewsQuery = useQuery({ queryKey: ["system-reviews"], queryFn: fetchSystemReviews });

  const systemMutation = useMutation({
    mutationFn: () => createSystemReview(rating, comment),
    onSuccess: async () => {
      setComment("");
      setRating(5);
      await queryClient.invalidateQueries({ queryKey: ["system-reviews"] });
      toast.success("Thanks for rating the platform");
    },
    onError: () => toast.error("Failed to save rating"),
  });

  const reviews = isAdmin ? listingReviewsQuery.data ?? [] : systemReviewsQuery.data ?? [];

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: P }} />
        <h1 className="text-2xl font-bold text-slate-900">{isAdmin ? "All Listing Reviews" : "Platform Reviews"}</h1>
      </div>

      {!isAdmin && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!comment.trim()) return;
            systemMutation.mutate();
          }}
          className="rounded-lg border border-black/5 shadow-sm p-5 mb-6"
          style={{ backgroundColor: BG }}
        >
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} stars`}>
                <Star className={`w-6 h-6 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
            placeholder="Rate your experience with the platform"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button type="submit" disabled={systemMutation.isPending || !comment.trim()} className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: P }}>
            Submit Rating
          </button>
        </form>
      )}

      {(listingReviewsQuery.isLoading || systemReviewsQuery.isLoading) && <div className="text-sm text-slate-500">Loading reviews...</div>}
      <div className="space-y-4">
        {reviews.map((review) => {
          const listing = "listing" in review ? review.listing as { title: string; location: string } : null;
          return (
          <div key={review.id} className="rounded-lg border border-black/5 shadow-sm p-5" style={{ backgroundColor: BG }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                {review.user.avatar ? <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900 text-sm">{review.user.name}</p>
                  <Stars rating={review.rating} />
                </div>
                {listing && (
                  <p className="text-xs text-slate-500">
                    {listing.title} · {listing.location}
                  </p>
                )}
                <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">{review.comment}</p>
          </div>
        );})}
      </div>
      {reviews.length === 0 && <div className="text-sm text-slate-500">No reviews yet.</div>}
    </div>
  );
};

export default ReviewsPage;
