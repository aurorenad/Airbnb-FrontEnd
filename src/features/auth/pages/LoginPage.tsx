import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaApple, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import RegisterImage from "../../../assets/register.png";
import { useAuth } from "../hooks/useAuth";

const P = "#e8441a";

const LoginPage = () => {
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        try {
            await login(email, password);
            if (rememberMe) localStorage.setItem("remember_email", email);
            navigate(from, { replace: true });
        } catch {
            // error already set in context
        }
    };

    const displayError = localError ?? error;
    const inputClass =
        "w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white text-sm transition placeholder-slate-400";

    return (
        <div className="min-h-screen flex -mt-8">
            <div className="flex-1 flex items-center justify-center px-8 py-12 dark:bg-slate-900" style={{ backgroundColor: "#f7f3ef" }}>
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Welcome back!</h1>
                        <h2 className="text-3xl font-bold mb-4">
                            <span style={{ color: P }}>Sign in</span>{" "}
                            <span className="text-slate-900 dark:text-white">to continue.</span>
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Unlock exclusive content, enjoy special offers, and be the first to get exciting updates.
                        </p>
                    </div>

                    <div className="space-y-3 mb-6">
                        <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:opacity-90 transition font-medium text-sm">
                            <FaApple className="text-base" /> Sign in with Apple
                        </button>
                        <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium text-sm">
                            <FaGoogle className="text-base" /> Sign in with Google
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 dark:bg-slate-900 text-slate-400" style={{ backgroundColor: "#f7f3ef" }}>Or</span>
                        </div>
                    </div>

                    {displayError && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {displayError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Enter Email <span style={{ color: P }}>*</span>
                            </label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email" required className={inputClass} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Password <span style={{ color: P }}>*</span>
                            </label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required className={inputClass} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <input id="remember" type="checkbox" checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 cursor-pointer" />
                            <label htmlFor="remember" className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer">
                                Remember me next time
                            </label>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3 text-white font-semibold rounded-xl transition mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
                            style={{ backgroundColor: P }}>
                            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold" style={{ color: P }}>Sign up</Link> {/* ✅ */}
                    </p>
                    <p className="mt-2 text-center text-xs text-slate-400">
                        <Link to="/forgot-password" className="hover:underline" style={{ color: P }}>Forgot password?</Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 items-center justify-center dark:bg-slate-800 p-12" style={{ backgroundColor: "#ede8e3" }}>
                <div className="max-w-xl">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                        Effortlessly organize your workspace with ease.
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                    </p>
                    <img src={RegisterImage} alt="Sign in illustration" className="w-full h-auto" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
