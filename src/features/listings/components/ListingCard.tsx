import { memo } from "react";
import type { Listing } from "../types";
import { FaHeart, FaRegHeart, FaStar, FaPhone, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ListingCardProps {
  listing: Listing;
  saved: boolean;
  onToggleSave: () => void;
}

const ListingCard = memo(({ listing, saved, onToggleSave }: ListingCardProps) => {
  const { id, title, rating, reviews, featured, verified, discount, description, phone, img } = listing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      style={{ backgroundColor: "#f7f3ef" }}
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative w-72 h-48 flex-shrink-0 rounded-lg overflow-hidden">
          <Link to={`/listings/${id}`}>
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Featured badge */}
          {featured && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold text-slate-700 dark:text-slate-200 rounded flex items-center gap-1">
              <FaStar className="w-3 h-3 text-amber-400" />
              Featured
            </div>
          )}

          {/* Discount badge */}
          {discount && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-rose-500 text-white text-xs font-bold rounded">
              {discount}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-rose-500 text-sm font-semibold">
                  <FaStar className="w-4 h-4" />
                  <span>({rating})</span>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">
                    {reviews.toLocaleString()} reviews
                  </span>
                </div>
              </div>

              {/* Heart button */}
              <button
                onClick={onToggleSave}
                aria-label={saved ? "Remove from saved" : "Save listing"}
                className="p-1.5 hover:scale-110 transition-transform"
              >
                {saved
                  ? <FaHeart className="w-5 h-5 text-rose-500" />
                  : <FaRegHeart className="w-5 h-5 text-slate-400 hover:text-rose-500" />
                }
              </button>
            </div>

            {/* Title */}
            <Link to={`/listings/${id}`}>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 flex items-center gap-2 hover:text-rose-500 transition-colors">
                {title}
                {verified && (
                  <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                )}
              </h3>
            </Link>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <button className="flex items-center gap-2 hover:text-rose-500 transition-colors">
              <FaPhone className="w-4 h-4" />
              <span>{phone}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-rose-500 transition-colors">
              <FaMapMarkerAlt className="w-4 h-4" />
              <span>Directions</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ListingCard.displayName = "ListingCard";

export default ListingCard;
