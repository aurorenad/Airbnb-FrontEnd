import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalSchema, type PersonalData } from "../schemas/booking";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";

const P = "#e8441a";

interface Props { onNext: (data: PersonalData) => void; onBack: () => void; defaultValues?: Partial<PersonalData>; }

const StepPersonal = ({ onNext, onBack, defaultValues }: Props) => {
     const { register, handleSubmit, setValue, formState: { errors } } = useForm<PersonalData>({
         resolver: zodResolver(personalSchema),
         defaultValues,
     });
     const [preview, setPreview] = useState<string | null>(null);

     const hasDefaultValues = !!(defaultValues?.name && defaultValues?.email && defaultValues?.phone);

     const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (file) {
             setValue("photo", file, { shouldValidate: true });
             setPreview(URL.createObjectURL(file));
         }
     };

     const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
     const errClass = "text-xs text-rose-500 mt-1";

     return (
         <form onSubmit={handleSubmit(onNext)} className="space-y-5">
             {hasDefaultValues ? (
                 <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                     <div>
                         <p className="text-xs text-slate-500 font-medium mb-1">Full Name</p>
                         <p className="text-slate-900 font-medium">{defaultValues?.name}</p>
                     </div>
                     <div>
                         <p className="text-xs text-slate-500 font-medium mb-1">Email</p>
                         <p className="text-slate-900 font-medium">{defaultValues?.email}</p>
                     </div>
                     <div>
                         <p className="text-xs text-slate-500 font-medium mb-1">Phone</p>
                         <p className="text-slate-900 font-medium">{defaultValues?.phone}</p>
                     </div>
                 </div>
             ) : (
                 <>
                     <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                         <input type="text" {...register("name")} placeholder="Your full name" className={inputClass} style={{ backgroundColor: "#f7f3ef" }} />
                         {errors.name && <p className={errClass}>{errors.name.message}</p>}
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                         <input type="email" {...register("email")} placeholder="you@example.com" className={inputClass} style={{ backgroundColor: "#f7f3ef" }} />
                         {errors.email && <p className={errClass}>{errors.email.message}</p>}
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                         <input type="tel" {...register("phone")} placeholder="+250 781 940 884" className={inputClass} style={{ backgroundColor: "#f7f3ef" }} />
                         {errors.phone && <p className={errClass}>{errors.phone.message}</p>}
                     </div>
                 </>
             )}
             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Profile Photo *</label>
                 <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-orange-300 transition-colors" style={{ backgroundColor: "#f7f3ef" }}>
                     {preview
                         ? <img src={preview} alt="preview" className="w-24 h-24 rounded-full object-cover mb-2" />
                         : <Upload className="w-8 h-8 text-slate-300 mb-2" />
                     }
                     <span className="text-xs text-slate-400">{preview ? "Click to change" : "Click to upload"}</span>
                     <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                 </label>
                 {errors.photo && <p className={errClass}>{errors.photo.message as string}</p>}
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

export default StepPersonal;
