import { useEffect, lazy, Suspense, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import Navbar from "./shared/components/Navbar";
import SearchBar from "./shared/components/SearchBar";
import Spinner from "./shared/components/Spinner";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import NotFound from "./shared/components/NotFound";
import Footer from "./shared/components/Footer";

import { useStore } from "./store/StoreContext";
import ListingsPage from "./features/listings/pages/ListingsPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import AddListingPage from "./features/listings/pages/AddListingPage";
import SavedListings from "./features/listings/components/SavedListings";
import HomePage from "./features/auth/pages/HomePage";
import { useAuth } from "./features/auth/hooks/useAuth";
import AiChatbot from "./features/listings/components/AiChatbot";

// Lazy load heavy pages
const ListingDetail = lazy(() => import("./features/listings/pages/ListingDetail"));
const DashboardPage = lazy(() => import("./features/auth/pages/DashboardPage"));
const DashboardHome = lazy(() =>
  import("./features/auth/pages/DashboardPage").then(m => ({ default: m.DashboardHome }))
);
const EditProfilePage = lazy(() => import("./features/dashboard/pages/EditProfilePage"));
const BookmarkPage = lazy(() => import("./features/dashboard/pages/BookmarkPage"));
const MessagePage = lazy(() => import("./features/dashboard/pages/MessagePage"));
const MyListingPage = lazy(() => import("./features/dashboard/pages/MyListingPage"));
const ReviewsPage = lazy(() => import("./features/dashboard/pages/ReviewsPage"));
const BookingsPage = lazy(() => import("./features/dashboard/pages/BookingsPage"));
const WalletPage = lazy(() => import("./features/dashboard/pages/WalletPage"));
const BecomeHostPage = lazy(() => import("./features/host/pages/BecomeHostPage"));
const ManageUsersPage = lazy(() => import("./features/dashboard/pages/ManageUsersPage"));
const SettingsPage = lazy(() => import("./features/dashboard/pages/SettingsPage"));

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

const HostRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isHost, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isHost) return <Navigate to="/become-a-host" replace />;

  return <>{children}</>;
};

const App = () => {
  const location = useLocation();
  const { state } = useStore();
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  // Progress Bar on Route Change
  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen dark:bg-slate-950 transition-colors duration-300 flex flex-col" style={{ backgroundColor: "#f7f3ef" }}>
      <Navbar
        savedCount={state.saved.length}
        onOpenSaved={() => setIsSavedOpen(true)}
      />

      {/* SearchBar only on listings page */}
      {location.pathname === "/listings" && <SearchBar />}

      <main className="flex-1">
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<div className="container mx-auto px-4 py-8"><ListingsPage /></div>} />
            <Route path="/listings/:id" element={<div className="container mx-auto px-4 py-8"><ListingDetail /></div>} />
            <Route path="/login" element={<div className="container mx-auto px-4 py-8"><LoginPage /></div>} />
            <Route path="/register" element={<div className="container mx-auto px-4 py-8"><RegisterPage /></div>} />
            <Route path="/add-listing" element={<HostRoute><div className="container mx-auto px-4 py-8"><AddListingPage /></div></HostRoute>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="edit-profile" element={<EditProfilePage />} />
              <Route path="bookmarks" element={<BookmarkPage />} />
              <Route path="messages" element={<MessagePage />} />
              <Route path="my-listings" element={<MyListingPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="users" element={<ManageUsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<div className="container mx-auto px-4 py-8"><NotFound /></div>} />
            <Route path="/become-a-host" element={<BecomeHostPage />} />
          </Routes>
        </Suspense>
      </main>

      <AiChatbot />
      
      <Footer />

      <SavedListings
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
      />
    </div>
  );
};

export default App;
