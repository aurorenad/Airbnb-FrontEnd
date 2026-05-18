import { useState } from "react";
import type React from "react";
import { useStore } from "../../../store/StoreContext";
import { useAuth } from "../hooks/useAuth";
import {
  LogOut, LayoutGrid, Star, TrendingUp, Users,
  MapPin, ArrowUpRight, PlusCircle, Wallet,
  MessageSquare, BookOpen, CalendarDays, Settings,
  UserCircle, ChevronLeft, X, AlignJustify,
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useListings } from "../../listings/hooks/useListings";

const P = "#e8441a";
const BG = "#f7f3ef";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  /** who can see this item */
  show: "all" | "non-admin" | "host-only" | "admin-only" | "host-or-admin";
  chevron?: boolean;
  isLogout?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    group: "MAIN MENU",
    items: [
      { label: "Dashboard",    icon: LayoutGrid,    href: "/dashboard",           show: "all" },
      // Add listing: hosts only, never admins
      { label: "Add listing",  icon: PlusCircle,    href: "/add-listing",         show: "host-only" },
      { label: "Wallet",       icon: Wallet,        href: "/dashboard/wallet",    show: "host-only" },
      { label: "Manage Users", icon: UserCircle,    href: "/dashboard/users",     show: "admin-only" },
      { label: "Message",      icon: MessageSquare, href: "/dashboard/messages",  show: "all" },
    ],
  },
  {
    group: "LISTING",
    items: [
      { label: "My Listing", icon: BookOpen,    href: "/dashboard/my-listings", chevron: true, show: "host-or-admin" },
      { label: "Bookings",   icon: CalendarDays, href: "/dashboard/bookings",  show: "host-only" },
      { label: "Reviews",    icon: Star,        href: "/dashboard/reviews",     show: "all" },
    ],
  },
  {
    group: "ACCOUNT",
    items: [
      { label: "Edit Profile", icon: UserCircle, href: "/dashboard/edit-profile", show: "all" },
      { label: "Setting",      icon: Settings,   href: "/dashboard/settings",     show: "all" },
      { label: "Logout",       icon: LogOut,     href: "#", isLogout: true,        show: "all" },
    ],
  },
];

/* ── Sidebar ── */
const Sidebar = ({
  collapsed, onToggle, onClose,
}: { collapsed: boolean; onToggle: () => void; onClose?: () => void }) => {
  const { logout, isHost, isAdmin } = useAuth();
  const location = useLocation();

  const canSee = (show: NavItem["show"]) => {
    if (show === "all") return true;
    if (show === "admin-only") return isAdmin;
    if (show === "non-admin") return !isAdmin;
    if (show === "host-only") return isHost && !isAdmin;
    if (show === "host-or-admin") return isHost || isAdmin;
    return false;
  };

  return (
    <div
      className="flex flex-col h-full shrink-0 relative transition-all duration-300"
      style={{ backgroundColor: BG, width: collapsed ? "64px" : "224px" }}
    >
      <button
        onClick={onToggle}
        className="absolute -right-4 top-6 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white hover:scale-105 transition-transform"
        style={{ backgroundColor: P }}
      >
        <AlignJustify className="w-3.5 h-3.5 text-white" />
      </button>

      {onClose && (
        <div className="flex justify-end px-3 pt-4 lg:hidden">
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-5 space-y-6">
        {NAV.map((section) => {
          const visibleItems = section.items.filter((item) => canSee(item.show));
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.group}>
              {!collapsed && (
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
                  {section.group}
                </p>
              )}
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  if (item.isLogout) {
                    return (
                      <li key={item.label}>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-800 hover:bg-black/5 transition-colors"
                          title={collapsed ? item.label : undefined}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {!collapsed && <span>{item.label}</span>}
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        onClick={onClose}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                          ${isActive ? "text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-black/5"}`}
                        style={isActive ? { backgroundColor: P } : {}}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                        {!collapsed && (
                          <>
                            <span className="flex-1 whitespace-nowrap">{item.label}</span>
                            {item.chevron && (
                              <ChevronLeft className={`w-3 h-3 ${isActive ? "text-white" : "text-slate-400"}`} />
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

import { useQuery } from "@tanstack/react-query";
import { fetchUsersStats } from "../../dashboard/api/usersApi";

/* ── Dashboard home ── */
export const DashboardHome = () => {
  const { state } = useStore();
  const { isHost, isAdmin } = useAuth();
  useListings();

  const usersStatsQuery = useQuery({
    queryKey: ["stats", "users"],
    queryFn: fetchUsersStats,
    enabled: isAdmin,
  });

  const totalListings = state.listings.length;
  const featuredCount = state.listings.filter((l) => l.featured).length;
  const avgRating =
    state.listings.length > 0
      ? (state.listings.reduce((sum, l) => sum + l.rating, 0) / state.listings.length).toFixed(1)
      : "0";
  const totalReviews = state.listings.reduce((sum, l) => sum + l.reviews, 0);

  const categoryMap: Record<string, number> = {};
  state.listings.forEach((l) => {
    categoryMap[l.category] = (categoryMap[l.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const recentListings = [...state.listings]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  const allStatCards = [
    { label: "Total Listings", value: totalListings,              icon: LayoutGrid, bg: "#eef2ff", iconColor: "#6366f1", trend: "+12% this week",           show: "host" },
    { label: "Avg. Rating",    value: avgRating,                  icon: Star,       bg: "#fffbeb", iconColor: "#f59e0b", trend: "Across all listings",       show: "host" },
    { label: "Total Reviews",  value: totalReviews.toLocaleString(), icon: Users,   bg: "#f0fdf4", iconColor: "#22c55e", trend: "+3.5k this week",           show: "host" },
    { label: "Featured",       value: featuredCount,              icon: TrendingUp, bg: "#faf5ff", iconColor: "#a855f7", trend: "Premium listings",          show: "host" },
  ];

  const statCards = allStatCards.filter((c) => {
    if (c.show === "host") return isHost;
    if (c.show === "non-admin") return !isAdmin;
    return true;
  });

  return (
    <>
      <div className="mb-6 hidden lg:block">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Welcome banner */}
      <div
        className="mb-8 rounded-2xl overflow-hidden relative min-h-[160px] flex items-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=400&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isAdmin ? "Admin Dashboard" : "Welcome back, Traveler!"}
          </h2>
          <p className="text-white/80 text-sm max-w-md mb-4">
            {isAdmin
              ? "Manage listings, users, bookings and platform analytics from here."
              : "Ready for your next adventure? Explore listings, check your saved places, and discover new destinations."}
          </p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: P }}
          >
            Browse Listings <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-2xl border border-black/5 shadow-sm"
            style={{ backgroundColor: "#fff" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: card.bg }}
            >
              <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
            </div>
            <p className="text-slate-400 text-xs">{card.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{card.value}</h3>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />{card.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Category breakdown */}
        <div className="rounded-2xl border border-black/5 shadow-sm p-6" style={{ backgroundColor: "#fff" }}>
          <h3 className="font-bold text-slate-900 mb-4">Listings by Type</h3>
          <div className="space-y-3">
            {topCategories.map(([cat, count]) => {
              const pct = Math.round((count / totalListings) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-slate-700">{cat}</span>
                    <span className="text-slate-400 text-xs">{count} listings</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: P }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent listings */}
        <div className="rounded-2xl border border-black/5 shadow-sm p-6" style={{ backgroundColor: "#fff" }}>
          <h3 className="font-bold text-slate-900 mb-4">Recent Listings</h3>
          <div className="space-y-3">
            {recentListings.map((listing) => (
              <Link key={listing.id} to={`/listings/${listing.id}`} className="flex items-center gap-3 group">
                <img src={listing.img} alt={listing.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-orange-500 transition-colors">
                    {listing.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" /><span>{listing.location}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-900">${listing.price}</p>
                  <div className="flex items-center gap-0.5 text-xs text-amber-400 justify-end">
                    <Star className="w-3 h-3 fill-amber-400" /><span>{listing.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/listings" className="mt-4 flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: P }}>
            View all listings <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* User Analytics (Admin Only) */}
        {isAdmin && usersStatsQuery.data && (
          <div className="rounded-2xl border border-black/5 shadow-sm p-6 md:col-span-2" style={{ backgroundColor: "#fff" }}>
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" /> Platform Users Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {["ADMIN", "HOST", "GUEST"].map((role) => {
                const count = usersStatsQuery.data.byRole.find(r => r.role === role)?._count.role || 0;
                const pct = Math.round((count / usersStatsQuery.data.totalUsers) * 100) || 0;
                return (
                  <div key={role} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-semibold text-slate-500 mb-1">{role}S</p>
                    <p className="text-2xl font-black text-slate-900">{count.toLocaleString()}</p>
                    <div className="w-full mt-3 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: role === "ADMIN" ? "#ef4444" : role === "HOST" ? "#f59e0b" : "#3b82f6" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: "/add-listing",         icon: PlusCircle,    bg: "#fff7ed", iconColor: P,         label: "Add Listing",  sub: "Post a new place",            show: "host-only" },
          { to: "/dashboard/messages",  icon: MessageSquare, bg: "#eff6ff", iconColor: "#3b82f6", label: "Messages",     sub: "Chat with hosts & guests",    show: "all" },
          { to: "/dashboard/users",     icon: Users,         bg: "#f0fdf4", iconColor: "#22c55e", label: "Manage Users", sub: "View all platform users",     show: "admin-only" },
        ]
          .filter((a) => {
            if (a.show === "all") return true;
            if (a.show === "admin-only") return isAdmin;
            if (a.show === "non-admin") return !isAdmin;
            if (a.show === "host-only") return isHost && !isAdmin;
            return false;
          })
          .map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex items-center gap-3 p-4 rounded-2xl border border-black/5 shadow-sm hover:border-orange-200 transition-colors group"
              style={{ backgroundColor: "#fff" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: a.bg }}
              >
                <a.icon className="w-5 h-5" style={{ color: a.iconColor }} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm group-hover:text-orange-500 transition-colors">
                  {a.label}
                </p>
                <p className="text-xs text-slate-400">{a.sub}</p>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

/* ══ Layout ══ */
const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]" style={{ backgroundColor: BG }}>
      <aside className="hidden lg:flex flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-visible border-r border-black/5 z-10">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 shadow-xl h-full">
            <Sidebar collapsed={false} onToggle={() => {}} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 p-6 md:p-8" style={{ backgroundColor: BG }}>
        <div className="flex items-center gap-3 mb-6 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: P }}
          >
            <AlignJustify className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;