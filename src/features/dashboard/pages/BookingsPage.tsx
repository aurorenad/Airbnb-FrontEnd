import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  approveBooking,
  cancelBooking,
  fetchHostBookings,
  type DashboardBooking,
} from "../api/bookingsApi";
import { useAuth } from "../../auth/hooks/useAuth";

const P = "#e8441a";

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: "text-green-600 bg-green-50",
  PENDING:   "text-amber-600 bg-amber-50",
  CANCELLED: "text-rose-600  bg-rose-50",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value)
  );

const fallbackImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=200&fit=crop";

const BookingsPage = () => {
  const { isHost } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const queryKey = ["host-bookings"];
  const queryFn = fetchHostBookings;

  const { data: bookings = [], isLoading, isError } = useQuery({ queryKey, queryFn });

  const approveMutation = useMutation({
    mutationFn: approveBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success("Booking approved");
    },
    onError: () => toast.error("Failed to approve booking"),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success("Booking cancelled");
    },
    onError: () => toast.error("Failed to cancel booking"),
  });

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return bookings.filter((b) =>
      `${b.listing.title} ${b.listing.location} ${b.guest?.name ?? ""} ${b.guest?.email ?? ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [bookings, search]);

  const pageItems  = filtered.slice((page - 1) * perPage, page * perPage);
  const pageCount  = Math.max(1, Math.ceil(filtered.length / perPage));

  if (!isHost) {
    return <Navigate to="/dashboard" replace />;
  }

  const pageTitle = "Booking Requests";
  const pageRole = "Host";

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold" style={{ color: P }}>{pageRole}</p>
          <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
          <p className="text-sm text-slate-500">
            Live booking data from your API.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            placeholder="Search bookings…"
          />
        </div>
      </div>

      <div className="rounded-lg border border-black/5 shadow-sm overflow-hidden bg-white">
        {isLoading && <div className="p-6 text-sm text-slate-500">Loading bookings…</div>}
        {isError  && <div className="p-6 text-sm text-rose-500">Failed to load bookings.</div>}
        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    {["Listing", "Dates", "Guests", "Price", "Guest", "Status", "Action"]
                      .map((h) => (
                      <th key={h as string} className="px-4 py-3 text-left font-semibold">{h as string}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((booking: DashboardBooking) => (
                    <tr key={booking.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.listing.photos?.[0]?.url ?? fallbackImage}
                            alt={booking.listing.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{booking.listing.title}</p>
                            <p className="text-xs text-slate-500">{booking.listing.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{booking.guests}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        ${booking.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p>{booking.guest?.name ?? "—"}</p>
                        {booking.guest?.email && (
                          <p className="text-xs" style={{ color: P }}>{booking.guest.email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[booking.status] ?? ""}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {/* Approve: host only, pending only */}
                          {booking.status === "PENDING" && (
                            <button
                              onClick={() => approveMutation.mutate(booking.id)}
                              disabled={approveMutation.isPending}
                              className="flex items-center gap-1 text-xs text-white font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50"
                              style={{ backgroundColor: P }}
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                          )}
                          {/* Cancel: everyone except already cancelled */}
                          {booking.status !== "CANCELLED" && (
                            <button
                              onClick={() => cancelMutation.mutate(booking.id)}
                              disabled={cancelMutation.isPending}
                              className="p-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="p-6 text-sm text-slate-500">No bookings found.</div>
            )}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
              <span>
                Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to{" "}
                {Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded border border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span
                  className="w-8 h-8 flex items-center justify-center rounded text-white text-xs font-bold"
                  style={{ backgroundColor: P }}
                >
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  className="p-1.5 rounded border border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;