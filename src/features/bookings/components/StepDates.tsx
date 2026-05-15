import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight } from "lucide-react";
import type { DatesData } from "../schemas/booking";

const P = "#e8441a";

// Keep guests as string in the form, parse to number on submit
const formSchema = z
    .object({
        checkIn: z.string().min(1, "Check-in date is required"),
        checkOut: z.string().min(1, "Check-out date is required"),
        guests: z.string().refine((v) => {
            const n = Number(v);
            return !isNaN(n) && n >= 1 && n <= 16;
        }, "Guests must be between 1 and 16"),
    })
    .refine((d) => new Date(d.checkOut) > new Date(d.checkIn), {
        message: "Check-out must be after check-in",
        path: ["checkOut"],
    });

type FormValues = z.infer<typeof formSchema>;

interface Props { onNext: (data: DatesData) => void; defaultValues?: Partial<DatesData>; }

const StepDates = ({ onNext, defaultValues }: Props) => {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const minCheckIn = tomorrow.toISOString().slice(0, 10);

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            checkIn: defaultValues?.checkIn ?? "",
            checkOut: defaultValues?.checkOut ?? "",
            guests: String(defaultValues?.guests ?? 1),
        },
    });

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
    const errClass = "text-xs text-rose-500 mt-1";

    const onSubmit = (values: FormValues) => {
        onNext({ ...values, guests: Number(values.guests) });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Check-in *</label>
                    <input type="date" min={minCheckIn} {...register("checkIn")} className={inputClass} style={{ backgroundColor: "#f7f3ef" }} />
                    {errors.checkIn && <p className={errClass}>{errors.checkIn.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Check-out *</label>
                    <input type="date" min={minCheckIn} {...register("checkOut")} className={inputClass} style={{ backgroundColor: "#f7f3ef" }} />
                    {errors.checkOut && <p className={errClass}>{errors.checkOut.message}</p>}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Guests *</label>
                <input type="number" min={1} max={16} {...register("guests")} className={inputClass} style={{ backgroundColor: "#f7f3ef" }} />
                {errors.guests && <p className={errClass}>{errors.guests.message}</p>}
            </div>
            <button type="submit" className="w-full py-3 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: P }}>
                Continue <ChevronRight className="w-4 h-4" />
            </button>
        </form>
    );
};

export default StepDates;
