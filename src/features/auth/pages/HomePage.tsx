import { Link } from "react-router-dom";
import { useListings } from "../../listings/hooks/useListings";
import {  ArrowRight, ChevronLeft, ChevronRight, Search, LocateFixed } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { createTestimonial, fetchTestimonials } from "../api/testimonialsApi";
import {
  FaBuilding, FaUtensils, FaMusic, FaShoppingBag, FaTv, FaDumbbell,
  FaArrowRight,
} from "react-icons/fa";

const P = "#e8441a";

/* ── scroll-reveal ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
};

/* italic light label above section headings */
const Label = ({ text, white = false }: { text: string; white?: boolean }) => (
  <p className="font-light italic text-base mb-2" style={{ color: white ? "rgba(255,255,255,0.75)" : P }}>
    {text}
  </p>
);

/* ── static data ── */
const categories = [
  { Icon: FaBuilding, name: "Apartment", count: "99+" },
  { Icon: FaUtensils, name: "Restaurant", count: "55+" },
  { Icon: FaMusic, name: "Music", count: "55+" },
  { Icon: FaShoppingBag, name: "Shopping", count: "80+" },
  { Icon: FaTv, name: "TV Shows", count: "96+" },
  { Icon: FaDumbbell, name: "Gymnasiums", count: "21+" },
];

const steps = [
  { num: "1", title: "Input your location to start looking for landmarks.", desc: "Enter your location to discover nearby places and landmarks." },
  { num: "2", title: "Make an appointment at the place you want to visit.", desc: "Browse results and book the place you want to visit." },
  { num: "3", title: "Visit the place and enjoy the experience.", desc: "Go there and create unforgettable memories." },
];

const cities = [
  { name: "Kingston", country: "Jamaica", count: "100+", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=300&h=400&fit=crop" },
  { name: "Amman", country: "Jordan", count: "59+", img: "https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=300&h=400&fit=crop" },
  { name: "Atlanta", country: "Brazil", count: "89+", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop" },
  { name: "Kigali", country: "Rwanda", count: "65+", img: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&h=400&fit=crop" },
  { name: "Cape Town", country: "South Africa", count: "95+", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=300&h=400&fit=crop" },
];

const testimonials = [
  { quote: "Found the perfect apartment in Kigali within minutes. The platform is incredibly easy to use and the listings are accurate.", name: "Marie K.", location: "Kigali, Rwanda", avatar: "https://i.pravatar.cc/60?img=5" },
  { quote: "I discovered amazing restaurants and events I never knew existed in my city. Highly recommend to anyone exploring a new place.", name: "James O.", location: "Nairobi, Kenya", avatar: "https://i.pravatar.cc/60?img=6" },
  { quote: "The search and filter features saved me so much time. I found exactly what I was looking for without any hassle.", name: "Amina B.", location: "Lagos, Nigeria", avatar: "https://i.pravatar.cc/60?img=7" },
];


/* ══════════════════════════════════════════════════════════════ */
const HomePage = () => {
  useListings();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [quote, setQuote] = useState("");
  const testimonialsQuery = useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials });
  const liveTestimonials = testimonialsQuery.data?.map((item) => ({
    quote: item.quote,
    name: item.user.name,
    location: new Date(item.createdAt).toLocaleDateString(),
    avatar: item.user.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user.name)}&background=e8441a&color=fff`,
  })) ?? [];
  const visibleTestimonials = liveTestimonials.length > 0 ? liveTestimonials : testimonials;
  const activeTestimonial = visibleTestimonials[testimonialIdx % visibleTestimonials.length];
  const testimonialMutation = useMutation({
    mutationFn: () => createTestimonial(quote),
    onSuccess: async () => {
      setQuote("");
      setTestimonialIdx(0);
      await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial shared");
    },
    onError: () => toast.error(isAuthenticated ? "Failed to share testimonial" : "Please log in first"),
  });

  return (
    <div className="overflow-x-hidden">

      {/* ══ 1. HERO ══
          Full-viewport mountain photo, dark overlay, centred text,
          search bar fully inside — exactly like the template screenshot */}
      <section
        className="relative flex items-center justify-center bg-cover bg-center -mt-8"
        style={{
          minHeight: "100vh",
          backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=900&fit=crop')",
        }}
      >
        {/* dark gradient overlay — heavier at top, lighter at bottom like template */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 100%)" }} />

        <div className="relative z-10 text-center text-white px-4 w-full max-w-3xl mx-auto">
          <Reveal>
            {/* small label */}
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: P }}>
              We Are #1 On The Market
            </p>
            {/* big headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-5">
              We're Here To Help You{" "}
              <span className="italic" style={{ color: P }}>Navigate</span>{" "}
              While Traveling
            </h1>
            <p className="text-slate-300 mb-10 text-lg">
              You'll get comprehensive results based on the provided location.
            </p>
          </Reveal>

          {/* ── search bar — white pill, button flush right ── */}
          <Reveal delay={180}>
            <div className="flex items-stretch bg-white rounded-full shadow-2xl overflow-hidden max-w-2xl mx-auto">
              {/* search icon + input */}
              <div className="flex items-center gap-2 flex-1 px-5 min-w-0">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="flex-1 text-slate-700 placeholder-slate-400 text-sm focus:outline-none py-4 bg-transparent min-w-0"
                />
              </div>
              {/* divider */}
              <div className="w-px bg-slate-200 my-3 shrink-0" />
              {/* location icon + input */}
              <div className="flex items-center gap-2 flex-1 px-5 min-w-0">
                <LocateFixed className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  className="flex-1 text-slate-700 placeholder-slate-400 text-sm focus:outline-none py-4 bg-transparent min-w-0"
                />
              </div>
              {/* button — part of the pill */}
              <Link
                to="/listings"
                className="shrink-0 text-white text-sm font-semibold px-7 flex items-center whitespace-nowrap rounded-r-full transition-opacity hover:opacity-90"
                style={{ backgroundColor: P }}
              >
                Search places
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 2. FEATURED CATEGORIES
          Dark city-skyline background, semi-transparent overlay,
          2×3 grid of category cards — matches template screenshot */}
      <section className="relative py-20 px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&h=700&fit=crop')" }}
      >
        {/* very dark overlay so cards are readable */}
        <div className="absolute inset-0" style={{ background: "rgba(15,23,42,0.88)" }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <Label text="Categories" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Featured Categories</h2>
            <p className="text-slate-400 text-sm">
              Discover exciting categories.{" "}
              <span style={{ color: P }}>Find what you're looking for.</span>
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(({ Icon, name, count }, i) => (
              <Reveal key={name} delay={i * 70}>
                <Link
                  to="/listings"
                  className="flex items-center justify-between rounded-xl px-5 py-4 group transition-colors border"
                  style={{ backgroundColor: "rgba(30,41,59,0.85)", borderColor: "rgba(71,85,105,0.6)" }}
                >
                  <div className="flex items-center gap-3">
                    {/* icon box */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${P}28` }}
                    >
                      <Icon style={{ color: P, fontSize: "1.1rem" }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{name}</p>
                      <p className="text-slate-400 text-xs">{count} listings</p>
                    </div>
                  </div>
                  <FaArrowRight className="text-slate-500 group-hover:text-white transition-colors text-xs" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. BEST WAY ══ */}
      <section className="py-20 px-4 dark:bg-slate-950" style={{ backgroundColor: "#f7f3ef" }}>
        <Reveal className="max-w-4xl mx-auto text-center mb-14">
          <Label text="Best Way" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Find Your Dream Place The Best Way
          </h2>
          <p className="text-slate-500 text-sm">
            Discover exciting categories.{" "}
            <span style={{ color: P }}>Find what you're looking for.</span>
          </p>
        </Reveal>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* curved dashed SVG connector */}
          <svg className="hidden md:block absolute top-6 left-0 w-full h-12 pointer-events-none" viewBox="0 0 800 48" fill="none">
            <path d="M80 24 Q200 0 400 24 Q600 48 720 24" stroke={P} strokeWidth="2" strokeDasharray="8 6" fill="none" />
          </svg>
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 120} className="text-center relative z-10">
              <div className="w-14 h-14 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5 shadow-lg" style={{ backgroundColor: P }}>
                {s.num}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm leading-snug">{s.title}</h3>
              <p className="text-slate-500 text-xs">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ 4. TOP REGIONS ══ */}
      <section className="py-20 px-4" style={{ backgroundColor: P }}>
        <Reveal className="max-w-5xl mx-auto text-center mb-10">
          <Label text="Top Regions" white />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Explore Cities</h2>
          <p className="text-white/70 text-sm">
            Discover exciting categories.{" "}
            <span className="font-semibold text-white">Find what you're looking for.</span>
          </p>
        </Reveal>

        <div className="max-w-5xl mx-auto flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
          {cities.map((city, i) => (
            <Reveal key={city.name} delay={i * 80}>
              <div className="relative min-w-[200px] h-[280px] rounded-2xl overflow-hidden flex-shrink-0 group cursor-pointer">
                <img src={city.img} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <p className="text-xs text-slate-300">{city.country}</p>
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <p className="text-xs text-white/60">{city.count} listings</p>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <span className="text-xs text-white font-semibold uppercase tracking-wide">Explore More</span>
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* find your perfect place — same orange bg */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 mt-16">
          <Reveal className="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&h=400&fit=crop" alt="Traveler" className="rounded-2xl w-full object-cover shadow-xl" />
          </Reveal>
          <Reveal delay={150} className="md:w-1/2 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Find your perfect Place based on <span className="italic">your interest</span>
            </h2>
            <ul className="space-y-2 text-white/80 text-sm mb-6">
              <li>• Find popular businesses and important sites near you.</li>
              <li>• Get place recommendations based on your preferences.</li>
              <li>• Explore major spots and landmarks around your location.</li>
              <li>• Discover diverse categories to navigate various areas.</li>
            </ul>
            <Link to="/register" className="inline-block bg-white font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-colors" style={{ color: P }}>
              Get Started Now
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══ 6. TESTIMONIAL ══ */}
      <section className="py-20 px-4 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1400&h=500&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <Reveal>
            <Label text="Testimonial" white />
            <h2 className="text-3xl md:text-4xl font-bold mb-10">See What Our Clients Say About Us</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left mb-6">
              <p className="text-4xl font-serif mb-3" style={{ color: P }}>"</p>
              <p className="text-slate-200 mb-6">{activeTestimonial.quote}</p>
              <div className="flex items-center gap-3">
                <img src={activeTestimonial.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-white text-sm">{activeTestimonial.name}</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: P }}>{activeTestimonial.location}</p>
                </div>
              </div>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!isAuthenticated) {
                  toast.error("Please log in to leave a testimonial");
                  return;
                }
                if (!quote.trim()) return;
                testimonialMutation.mutate();
              }}
              className="mb-6 flex flex-col sm:flex-row gap-2"
            >
              <input
                value={quote}
                onChange={(event) => setQuote(event.target.value)}
                placeholder={isAuthenticated ? `Share your testimony, ${user?.name?.split(" ")[0] ?? "friend"}` : "Log in to leave a testimony"}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button type="submit" disabled={testimonialMutation.isPending || !quote.trim()} className="rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: P }}>
                Share
              </button>
            </form>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setTestimonialIdx((p) => (p - 1 + visibleTestimonials.length) % visibleTestimonials.length)} className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors">
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <div className="flex gap-2">
                {visibleTestimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestimonialIdx(i)} className="w-2 h-2 rounded-full transition-colors" style={{ backgroundColor: i === testimonialIdx ? P : "rgba(255,255,255,0.35)" }} />
                ))}
              </div>
              <button onClick={() => setTestimonialIdx((p) => (p + 1) % visibleTestimonials.length)} className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors">
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
