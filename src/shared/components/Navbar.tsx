import { useState } from "react";
import {
  Heart, UserPlus, PlusCircle, Menu, X,
  LogIn, LayoutDashboard, Home, LogOut, User, Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import Logo from "../../assets/logo.png";
import { useAuth } from "../../features/auth/hooks/useAuth";

const P = "#e8441a";

interface NavbarProps {
  savedCount: number;
  onOpenSaved: () => void;
}

const Navbar = ({ savedCount, onOpenSaved }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, user, isHost, isAdmin, logout } = useAuth();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Listings", href: "/listings" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setIsOpen(false);
  };

  // Avatar initials fallback
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <nav
      className="sticky top-0 z-50 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
      style={{ backgroundColor: "rgba(247,243,239,0.92)" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img src={Logo} alt="ListOn" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <NavLink key={item.name} to={item.href}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : "text-slate-600 dark:text-slate-400"}`
                }>
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2">

            {/* Saved / wishlist */}
            <button onClick={onOpenSaved}
              className="p-2 relative text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-colors">
              <Heart className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {savedCount}
                </span>
              )}
            </button>

            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Guests: Become a Host CTA */}
                {!isHost && !isAdmin && (
                  <NavLink to="/become-a-host"
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors hover:bg-orange-50"
                    style={{ color: P, borderColor: P }}>
                    Become a Host
                  </NavLink>
                )}

                {/* Host-only: Add Listing */}
                {isHost && (
                  <NavLink to="/add-listing"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-white rounded-full hover:opacity-90 transition-all shadow-md text-xs md:text-sm font-semibold"
                    style={{ backgroundColor: P }}>
                    <PlusCircle className="w-4 h-4" />
                    Add Listing
                  </NavLink>
                )}

                {/* User avatar dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 transition-colors"
                    style={{ backgroundColor: "#f7f3ef" }}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: P }}>
                        {initials}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[100px] truncate">
                      {user?.name ?? user?.email}
                    </span>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 rounded-2xl shadow-xl border border-black/5 overflow-hidden z-50"
                        style={{ backgroundColor: "#f7f3ef" }}
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-black/5">
                          <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: P }}>
                            {user?.role}
                          </span>
                        </div>
                        <div className="py-1">
                          <Link to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-black/5 transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link to="/dashboard/edit-profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-black/5 transition-colors">
                            <User className="w-4 h-4" /> Edit Profile
                          </Link>
                          <Link to="/dashboard/settings"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-black/5 transition-colors">
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                {/* Not logged in */}
                <NavLink to="/login"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-full hover:border-slate-300 transition-colors">
                  <LogIn className="w-4 h-4" /> Sign In
                </NavLink>
                <NavLink to="/register"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-all shadow-md"
                  style={{ backgroundColor: P }}>
                  <UserPlus className="w-4 h-4" /> Sign Up
                </NavLink>
              </>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-black/5 rounded-lg transition-colors">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
            style={{ backgroundColor: "#f7f3ef" }}
          >
            <div className="px-4 py-4 space-y-1">
              {menuItems.map((item) => (
                <NavLink key={item.name} to={item.href} onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${isActive ? "text-white" : "text-slate-600 hover:bg-black/5"
                    }`
                  }
                  style={({ isActive }) => isActive ? { backgroundColor: P } : {}}>
                  {item.name === "Home" ? <Home className="w-5 h-5" />
                    : item.name === "Listings" ? <LayoutDashboard className="w-5 h-5" />
                      : <LayoutDashboard className="w-5 h-5" />}
                  {item.name}
                </NavLink>
              ))}

              <div className="pt-3 border-t border-black/5 space-y-1">
                <button onClick={() => { onOpenSaved(); setIsOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-3 text-slate-600 hover:bg-black/5 rounded-lg transition-colors">
                  <Heart className="w-5 h-5" /> Wishlist
                  {savedCount > 0 && (
                    <span className="ml-auto text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: P }}>
                      {savedCount}
                    </span>
                  )}
                </button>

                {isAuthenticated ? (
                  <>
                    {!isHost && !isAdmin && (
                      <NavLink to="/become-a-host" onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg font-semibold border-2 transition-colors"
                        style={{ color: P, borderColor: P }}>
                        Become a Host
                      </NavLink>
                    )}
                    {isHost && (
                      <NavLink to="/add-listing" onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 text-white rounded-lg font-semibold"
                        style={{ backgroundColor: P }}>
                        <PlusCircle className="w-5 h-5" /> Add Listing
                      </NavLink>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-3 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-slate-600 hover:bg-black/5 rounded-lg transition-colors">
                      <LogIn className="w-5 h-5" /> Sign In
                    </NavLink>
                    <NavLink to="/register" onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 px-5 py-3 text-white rounded-xl font-semibold shadow-md"
                      style={{ backgroundColor: P }}>
                      <UserPlus className="w-5 h-5" /> Sign Up
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
