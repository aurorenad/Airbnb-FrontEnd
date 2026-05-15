import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 bg-rose-50 dark:bg-rose-950/30 rounded-3xl flex items-center justify-center mb-8 animate-bounce">
        <span className="text-4xl font-black text-rose-500">404</span>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h1>
      <p className="text-slate-500 max-w-md mb-8">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-rose-500/20 active:scale-[0.98]"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
