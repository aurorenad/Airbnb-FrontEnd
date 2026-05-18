import { useMemo } from "react";
import { useStore } from "../../../store/StoreContext";
import { ShoppingCart, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const P = "#e8441a";
const BG = "#f7f3ef";

// Helper: generate a deterministic order ID from listing title
const generateOrderId = (title: string, index: number): string => {
  const charSum = Array.from(title).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const seed = charSum + index;
  const pseudo = Math.sin(seed) * 10000;
  return `#A${Math.floor(10000 + (pseudo % 90000))}`;
};

const WalletPage = () => {
    const { state } = useStore();

    const totalEarning = state.listings.reduce((s, l) => s + l.price, 0);
    const withdrawable = Math.round(totalEarning * 0.85);
    const pendingOrders = state.listings.filter(l => !l.featured).length;
    const totalOrders = state.listings.length;

    const earningListings = useMemo(() => state.listings.slice(0, 5).map((l, i) => ({
        title: l.title,
        img: l.img,
        amount: l.price,
        fee: Math.round(l.price * 0.05),
        net: Math.round(l.price * 0.95),
        order: generateOrderId(l.title, i),
        date: "05 Aug 2023",
    })), [state.listings]);

    const payouts = [
        { amount: 95.59, status: "Unpaid", period: 21.39, color: "#e8441a" },
        { amount: 278.59, status: "Paid", period: 71.39, color: "#22c55e" },
    ];

    const statCards = [
        { label: "Withdrawable Balance", value: `$${withdrawable.toLocaleString()}`, sub: "(USD)" },
        { label: "Total Earning", value: `$${totalEarning.toLocaleString()}`, sub: "(USD)" },
        { label: "Listing Pending Order", value: `$${(pendingOrders * 99).toLocaleString()}`, sub: "(USD)" },
        { label: "Listing Total Order", value: totalOrders, sub: "" },
    ];

    return (
        <div className="max-w-5xl mx-auto py-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statCards.map(c => (
                    <div key={c.label} className="rounded-2xl border border-black/5 shadow-sm p-5 relative overflow-hidden" style={{ backgroundColor: BG }}>
                        {/* decorative circle */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: P }} />
                        <p className="text-xs text-slate-500 mb-1">{c.label}</p>
                        <h3 className="text-2xl font-bold text-slate-900">{c.value}</h3>
                        {c.sub && <p className="text-xs text-slate-400">{c.sub}</p>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Listings Earning */}
                <div className="rounded-2xl border border-black/5 shadow-sm p-5" style={{ backgroundColor: BG }}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: P }} />
                        <h3 className="font-bold text-slate-900">Listings Earning</h3>
                    </div>
                    <div className="space-y-3">
                        {earningListings.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 py-2 border-b border-black/5 last:border-0">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${P}15` }}>
                                    <ShoppingCart className="w-4 h-4" style={{ color: P }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 text-sm truncate">{item.title}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        <span className="text-slate-600">${item.amount}</span>
                                        {" / "}Fee: <span style={{ color: P }}>${item.fee}</span>
                                        {" / "}Net Earning: <span className="text-green-600">${item.net}</span>
                                        {" / "}Order: <span className="text-slate-500">{item.order}</span>
                                        {" / "}Date: {item.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payout History */}
                <div className="rounded-2xl border border-black/5 shadow-sm p-5" style={{ backgroundColor: BG }}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: P }} />
                        <h3 className="font-bold text-slate-900">Payout History</h3>
                    </div>
                    <div className="space-y-3">
                        {payouts.map((p, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-black/5">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${p.color}15` }}>
                                    {p.status === "Paid"
                                        ? <ArrowUpRight className="w-4 h-4" style={{ color: p.color }} />
                                        : <ArrowDownLeft className="w-4 h-4" style={{ color: p.color }} />
                                    }
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900">${p.amount}</p>
                                    <p className="text-xs" style={{ color: p.color }}>{p.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Period: ${p.period}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-4 w-full py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: P }}>
                        Request Payout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
