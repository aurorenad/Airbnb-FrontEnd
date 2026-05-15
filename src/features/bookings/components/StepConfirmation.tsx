import type { DatesData, PersonalData, PaymentData } from "../schemas/booking";
import { CheckCircle, Loader2, ChevronLeft } from "lucide-react";

const P = "#e8441a";

interface Props {
    dates: DatesData;
    personal: PersonalData;
    payment: PaymentData;
    onBack: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    isSuccess: boolean;
    error: string | null;
}

const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-2 border-b border-black/5 last:border-0">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
);

const StepConfirmation = ({ dates, personal, payment, onBack, onConfirm, isSubmitting, isSuccess, error }: Props) => {
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h3 className="text-xl font-bold text-slate-900">Booking Confirmed!</h3>
                <p className="text-slate-500 text-sm">Your booking has been submitted successfully. You'll receive a confirmation email shortly.</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <h3 className="font-bold text-slate-900">Review Your Booking</h3>

            <div className="rounded-xl border border-black/5 p-4" style={{ backgroundColor: "#f7f3ef" }}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Dates</p>
                <Row label="Check-in" value={dates.checkIn} />
                <Row label="Check-out" value={dates.checkOut} />
                <Row label="Guests" value={String(dates.guests)} />
            </div>

            <div className="rounded-xl border border-black/5 p-4" style={{ backgroundColor: "#f7f3ef" }}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Personal Info</p>
                <Row label="Name" value={personal.name} />
                <Row label="Email" value={personal.email} />
                <Row label="Phone" value={personal.phone} />
                {personal.photo && <Row label="Photo" value={personal.photo.name} />}
            </div>

            <div className="rounded-xl border border-black/5 p-4" style={{ backgroundColor: "#f7f3ef" }}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Payment</p>
                <Row label="Card" value={`**** **** **** ${payment.card.slice(-4)}`} />
                <Row label="Expiry" value={payment.expiry} />
                <Row label="CVV" value="***" />
            </div>

            {error && <p className="text-xs text-rose-500 text-center">{error}</p>}

            <div className="flex gap-3">
                <button onClick={onBack} disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold flex items-center justify-center gap-2 hover:bg-black/5 transition-colors disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={onConfirm} disabled={isSubmitting}
                    className="flex-1 py-3 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ backgroundColor: P }}>
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Confirming…</> : "Confirm Booking"}
                </button>
            </div>
        </div>
    );
};

export default StepConfirmation;
