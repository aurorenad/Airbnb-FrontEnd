import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, type PaymentData } from "../schemas/booking";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";

const P = "#e8441a";

interface Props { onNext: (data: PaymentData) => void; onBack: () => void; defaultValues?: Partial<PaymentData>; }

const StepPayment = ({ onNext, onBack, defaultValues }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<PaymentData>({
        resolver: zodResolver(paymentSchema),
        defaultValues,
    });

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
    const errClass = "text-xs text-rose-500 mt-1";

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5" style={{ color: P }} />
                <span className="font-semibold text-slate-700">Payment Details</span>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Card Number *</label>
                <input type="text" maxLength={16} {...register("card")} placeholder="1234567890123456" className={inputClass} style={{ backgroundColor: "#f7f3ef" }} />
                {errors.card && <p className={errClass}>{errors.card.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry (MM/YY) *</label>
                    <input type="text" maxLength={5} {...register("expiry")} placeholder="08/27" className={inputClass} style={{ backgroundColor: "#f7f3ef" }} />
                    {errors.expiry && <p className={errClass}>{errors.expiry.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CVV *</label>
                    <input type="text" maxLength={3} {...register("cvv")} placeholder="123" className={inputClass} style={{ backgroundColor: "#f7f3ef" }} />
                    {errors.cvv && <p className={errClass}>{errors.cvv.message}</p>}
                </div>
            </div>
            <div className="flex gap-3">
                <button type="button" onClick={onBack} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold flex items-center justify-center gap-2 hover:bg-black/5 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" className="flex-1 py-3 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: P }}>
                    Continue <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </form>
    );
};

export default StepPayment;
