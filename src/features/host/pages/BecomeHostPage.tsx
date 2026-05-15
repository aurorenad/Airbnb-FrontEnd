import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Home, Building2, Warehouse, Coffee, Anchor, TreePine,
    Truck, Castle, Mountain, Container, Wifi, Tv, UtensilsCrossed,
    WashingMachine, Car, Snowflake, Briefcase, Users, DoorOpen,
    ChevronRight, ChevronLeft, Check, Upload, MapPin, X,
} from "lucide-react";

const P = "#e8441a";
const BG = "#f7f3ef";

/* ── Data ── */
const PLACE_TYPES = [
    { id: "HOUSE", label: "House", Icon: Home },
    { id: "APARTMENT", label: "Apartment", Icon: Building2 },
    { id: "BARN", label: "Barn", Icon: Warehouse },
    { id: "BNB", label: "Bed & breakfast", Icon: Coffee },
    { id: "BOAT", label: "Boat", Icon: Anchor },
    { id: "CABIN", label: "Cabin", Icon: TreePine },
    { id: "CAMPER", label: "Camper/RV", Icon: Truck },
    { id: "CASTLE", label: "Castle", Icon: Castle },
    { id: "CAVE", label: "Cave", Icon: Mountain },
    { id: "CONTAINER", label: "Container", Icon: Container },
    { id: "VILLA", label: "Villa", Icon: Home },
    { id: "STUDIO", label: "Studio", Icon: Building2 },
];

const SPACE_TYPES = [
    { id: "entire", label: "An entire place", desc: "Guests have the whole place to themselves.", Icon: Home },
    { id: "room", label: "A room", desc: "Guests have their own room in a home, plus access to shared spaces.", Icon: DoorOpen },
    { id: "shared", label: "A shared room in a hostel", desc: "Guests sleep in a shared room in a professionally managed hostel with staff onsite 24/7.", Icon: Users },
];

const AMENITIES = [
    { id: "wifi", label: "Wifi", Icon: Wifi },
    { id: "tv", label: "TV", Icon: Tv },
    { id: "kitchen", label: "Kitchen", Icon: UtensilsCrossed },
    { id: "washer", label: "Washer", Icon: WashingMachine },
    { id: "parking", label: "Free parking on premises", Icon: Car },
    { id: "ac", label: "Air conditioning", Icon: Snowflake },
    { id: "workspace", label: "Dedicated workspace", Icon: Briefcase },
];

/* ── Step indicator ── */
const STEPS = ["Place type", "Space type", "Location", "Basics", "Amenities", "Photos", "Details"];

const StepDot = ({ idx, current }: { idx: number; current: number }) => (
    <div className={`w-2.5 h-2.5 rounded-full transition-all ${idx === current ? "scale-125" : ""}`}
        style={{ backgroundColor: idx <= current ? P : "#cbd5e1" }} />
);

/* ── Counter ── */
const Counter = ({ label, value, onChange, min = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) => (
    <div className="flex items-center justify-between py-4 border-b border-black/5 last:border-0">
        <span className="text-slate-900 font-medium">{label}</span>
        <div className="flex items-center gap-4">
            <button onClick={() => onChange(Math.max(min, value - 1))}
                className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-500 transition-colors text-lg font-light">−</button>
            <span className="w-6 text-center font-semibold text-slate-900">{value}</span>
            <button onClick={() => onChange(value + 1)}
                className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-500 transition-colors text-lg font-light">+</button>
        </div>
    </div>
);

/* ══ Main component ══ */
const BecomeHostPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const [placeType, setPlaceType] = useState("");
    const [spaceType, setSpaceType] = useState("");
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const [guests, setGuests] = useState(2);
    const [bedrooms, setBedrooms] = useState(1);
    const [beds, setBeds] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [photos, setPhotos] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const toggleAmenity = (id: string) =>
        setAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);

    const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const urls = files.map(f => URL.createObjectURL(f));
        setPhotos(prev => [...prev, ...urls].slice(0, 10));
    };

    const canNext = () => {
        if (step === 0) return !!placeType;
        if (step === 1) return !!spaceType;
        if (step === 2) return location.trim().length > 2;
        if (step === 5) return photos.length >= 3;
        if (step === 6) return title.trim().length > 3 && !!price;
        return true;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        // In a real app: POST to /api/v1/listings with FormData
        await new Promise(r => setTimeout(r, 1200));
        setSubmitting(false);
        setDone(true);
    };

    if (done) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
                <div className="text-center max-w-md px-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${P}20` }}>
                        <Check className="w-10 h-10" style={{ color: P }} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">You're a host!</h1>
                    <p className="text-slate-500 mb-8">Your listing has been submitted for review. We'll notify you once it's live.</p>
                    <button onClick={() => navigate("/dashboard")}
                        className="text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: P }}>
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1.5">
                    {STEPS.map((_, i) => <StepDot key={i} idx={i} current={step} />)}
                </div>
                <span className="text-xs text-slate-400">{step + 1} / {STEPS.length}</span>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-start justify-center px-4 py-10">
                <div className="w-full max-w-2xl">

                    {/* ── Step 0: Place type ── */}
                    {step === 0 && (
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-8">Which of these best describes your place?</h1>
                            <div className="grid grid-cols-3 gap-3">
                                {PLACE_TYPES.map(({ id, label, Icon }) => (
                                    <button key={id} onClick={() => setPlaceType(id)}
                                        className={`flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${placeType === id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"}`}>
                                        <Icon className="w-7 h-7 text-slate-700" />
                                        <span className="text-sm font-medium text-slate-800">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Step 1: Space type ── */}
                    {step === 1 && (
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-8">What type of place will guests have?</h1>
                            <div className="space-y-3">
                                {SPACE_TYPES.map(({ id, label, desc, Icon }) => (
                                    <button key={id} onClick={() => setSpaceType(id)}
                                        className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all text-left ${spaceType === id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"}`}>
                                        <div>
                                            <p className="font-semibold text-slate-900">{label}</p>
                                            <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
                                        </div>
                                        <Icon className="w-8 h-8 text-slate-600 shrink-0 ml-4" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Location ── */}
                    {step === 2 && (
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Where is your place located?</h1>
                            <p className="text-slate-500 mb-8">Your address is only shared with guests after they book.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City / Region *</label>
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                        <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                                            placeholder="e.g. Kigali, Rwanda"
                                            className="flex-1 bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400 text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Address (optional)</label>
                                    <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                                        placeholder="Street address"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-700 placeholder:text-slate-400" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Basics ── */}
                    {step === 3 && (
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Share some basics about your place</h1>
                            <p className="text-slate-500 mb-8">You'll add more details later, like bed types.</p>
                            <div className="rounded-2xl border border-black/5 bg-white px-6">
                                <Counter label="Guests" value={guests} onChange={setGuests} />
                                <Counter label="Bedrooms" value={bedrooms} onChange={setBedrooms} />
                                <Counter label="Beds" value={beds} onChange={setBeds} />
                                <Counter label="Bathrooms" value={bathrooms} onChange={setBathrooms} />
                            </div>
                        </div>
                    )}

                    {/* ── Step 4: Amenities ── */}
                    {step === 4 && (
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tell guests what your place has to offer</h1>
                            <p className="text-slate-500 mb-8">You can add more amenities after you publish your listing.</p>
                            <p className="text-sm font-semibold text-slate-700 mb-4">What about these guest favorites?</p>
                            <div className="grid grid-cols-3 gap-3">
                                {AMENITIES.map(({ id, label, Icon }) => (
                                    <button key={id} onClick={() => toggleAmenity(id)}
                                        className={`flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${amenities.includes(id) ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"}`}>
                                        <Icon className="w-6 h-6 text-slate-700" />
                                        <span className="text-sm font-medium text-slate-800">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Step 5: Photos ── */}
                    {step === 5 && (
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Add some photos of your place</h1>
                            <p className="text-slate-500 mb-8">You'll need at least 3 photos to get started. You can always add more later.</p>

                            {photos.length < 10 && (
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-10 cursor-pointer hover:border-orange-400 transition-colors mb-4 bg-white">
                                    <Upload className="w-10 h-10 text-slate-300 mb-3" />
                                    <span className="text-sm font-medium text-slate-600">Click to upload photos</span>
                                    <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB each</span>
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                                </label>
                            )}

                            {photos.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {photos.map((src, i) => (
                                        <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                            <button onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                                                className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                                                <X className="w-3 h-3" />
                                            </button>
                                            {i === 0 && (
                                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded">Cover</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {photos.length < 3 && (
                                <p className="text-xs text-rose-500 mt-3">Please add at least {3 - photos.length} more photo{3 - photos.length > 1 ? "s" : ""}.</p>
                            )}
                        </div>
                    )}

                    {/* ── Step 6: Title, description, price ── */}
                    {step === 6 && (
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Now, let's give your place a title</h1>
                            <p className="text-slate-500 mb-8">Short titles work best. Have fun with it — you can always change it later.</p>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Listing title *</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Cozy apartment in Kigali city center"
                                        maxLength={60}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-700" />
                                    <p className="text-xs text-slate-400 mt-1 text-right">{title.length}/60</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                                        rows={4} placeholder="Tell guests what makes your place special..."
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-700 resize-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Price per night (USD) *</label>
                                    <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                        <span className="text-slate-400 mr-2">$</span>
                                        <input type="number" min={1} value={price} onChange={e => setPrice(e.target.value)}
                                            placeholder="0"
                                            className="flex-1 bg-transparent focus:outline-none text-slate-700 text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom nav */}
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-black/5 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors underline"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>

                {step < STEPS.length - 1 ? (
                    <button
                        onClick={() => setStep(s => s + 1)}
                        disabled={!canNext()}
                        className="flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-full transition-opacity disabled:opacity-40 hover:opacity-90"
                        style={{ backgroundColor: P }}
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!canNext() || submitting}
                        className="flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-full transition-opacity disabled:opacity-40 hover:opacity-90"
                        style={{ backgroundColor: P }}
                    >
                        {submitting ? "Submitting…" : "Publish listing"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BecomeHostPage;
