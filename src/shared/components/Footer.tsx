import footerImg from "../../assets/footer (2).png";
import Logo from "../../assets/logo.png";
import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FaApple, FaGooglePlay, FaInstagram, FaTwitter, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const P = "#e8441a";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 mt-16">

            {/* ── App download banner ── */}
            <div className="container mx-auto px-4 py-10">
                <div
                    className="rounded-2xl flex flex-col md:flex-row items-center justify-between px-8 py-6 gap-6"
                    style={{ backgroundColor: P }}
                >
                    <img src={footerImg} alt="Mobile App" className="h-36 object-contain" />
                    <div className="flex-1 text-white">
                        <h3 className="text-2xl font-bold mb-1">Download Our App</h3>
                        <p className="text-white/80 text-sm max-w-xs">
                            Search and discover nearby landmarks and places around you.
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <a href="#" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                            <FaApple className="text-base" />
                            <span>App Store</span>
                        </a>
                        <a href="#" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                            <FaGooglePlay className="text-base" />
                            <span>Google Play</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* ── Main columns ── */}
            <div className="container mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Get in Touch */}
                <div>
                    <h4 className="text-white font-semibold text-base mb-3">Get In Touch</h4>
                    <p className="text-sm text-slate-400 mb-4">
                        Join our newsletter and receive the best listings right on your inbox.
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${P}22` }}>
                            <FaWhatsapp style={{ color: P }} />
                        </div>
                        <span className="text-sm">+250 781 940 884</span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${P}22` }}>
                            <Mail className="w-4 h-4" style={{ color: P }} />
                        </div>
                        <span className="text-sm">aurorenadine25@gmail.com</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-1">Want to join us? Write us!</p>
                    <a href="mailto:aurorenadine25@gmail.com" className="text-sm hover:underline" style={{ color: P }}>
                        aurorenadine25@gmail.com
                    </a>
                </div>

                {/* Stay Connected */}
                <div>
                    <h4 className="text-white font-semibold text-base mb-3">Stay Connected</h4>
                    <p className="text-sm text-slate-400 mb-4">
                        Follow us and stay up to date with the latest listings and news.
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${P}22` }}>
                            <Phone className="w-4 h-4" style={{ color: P }} />
                        </div>
                        <span className="text-sm">+250 781 940 884</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${P}22` }}>
                            <Mail className="w-4 h-4" style={{ color: P }} />
                        </div>
                        <span className="text-sm">aurorenadine25@gmail.com</span>
                    </div>
                </div>

                {/* Newsletter + Social */}
                <div>
                    <h4 className="text-white font-semibold text-base mb-3">Get In Touch</h4>
                    <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 mb-6">
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="flex-1 bg-slate-800 border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                            style={{ borderColor: "#334155" }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = P)}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#334155")}
                        />
                        <button
                            type="submit"
                            className="text-white rounded-lg px-4 py-2 transition-opacity hover:opacity-90 font-bold"
                            style={{ backgroundColor: P }}
                        >
                            →
                        </button>
                    </form>

                    <h4 className="text-white font-semibold text-sm mb-3">Follow the location</h4>
                    <div className="flex gap-3">
                        {[FaInstagram, FaTwitter, FaFacebookF, FaWhatsapp].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
                                style={{ borderColor: "#475569", color: "#94a3b8" }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = P;
                                    e.currentTarget.style.color = P;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#475569";
                                    e.currentTarget.style.color = "#94a3b8";
                                }}
                            >
                                <Icon className="text-sm" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className="border-t border-slate-800">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <img src={Logo} alt="Logo" className="h-7 object-contain" />
                        <span className="text-sm text-slate-400">© {year} ListOn · All Rights Reserved</span>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-400">
                        <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Sitemap</Link>
                        <Link to="#" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
