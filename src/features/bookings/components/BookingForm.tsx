import { useBooking } from "../hooks/useBooking";
import StepDates from "./StepDates";
import StepPersonal from "./StepPersonal";
import StepPayment from "./StepPayment";
import StepConfirmation from "./StepConfirmation";
import type { DatesData, PersonalData, PaymentData } from "../schemas/booking";
import type { ListingId } from "../../listings/types";

const P = "#e8441a";
const STEPS = ["Dates", "Personal", "Payment", "Confirm"];

interface Props { listingId: ListingId; onClose: () => void; }

const BookingForm = ({ listingId, onClose }: Props) => {
    const { currentStep, data, next, back, submit, isSubmitting, isSuccess, error, defaultPersonal } = useBooking(listingId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-lg rounded-2xl shadow-2xl p-6 relative" style={{ backgroundColor: "#f7f3ef" }}>
                {/* Close */}
                {!isSuccess && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
                )}

                {/* Header */}
                <h2 className="text-xl font-bold text-slate-900 mb-1">Book this listing</h2>
                <p className="text-slate-400 text-sm mb-5">Step {currentStep + 1} of {STEPS.length}</p>

                {/* Step indicators */}
                <div className="flex items-center gap-2 mb-6">
                    {STEPS.map((label, i) => (
                        <div key={label} className="flex items-center gap-2 flex-1">
                            <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < currentStep ? "text-white" : i === currentStep ? "text-white" : "bg-slate-200 text-slate-400"
                                    }`} style={i <= currentStep ? { backgroundColor: P } : {}}>
                                    {i < currentStep ? "✓" : i + 1}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{label}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className="flex-1 h-px mb-4" style={{ backgroundColor: i < currentStep ? P : "#e2e8f0" }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step content */}
                {currentStep === 0 && (
                    <StepDates onNext={(d) => next(d as DatesData)} defaultValues={data.dates} />
                )}
                {currentStep === 1 && (
                    <StepPersonal onNext={(d) => next(d as PersonalData)} onBack={back} defaultValues={data.personal} />
                )}
                {currentStep === 2 && (
                    <StepPayment onNext={(d) => next(d as PaymentData)} onBack={back} defaultValues={data.payment} />
                )}
                {currentStep === 3 && data.dates && data.personal && data.payment && (
                    <StepConfirmation
                        dates={data.dates as DatesData}
                        personal={data.personal as PersonalData}
                        payment={data.payment as PaymentData}
                        onBack={back}
                        onConfirm={submit}
                        isSubmitting={isSubmitting}
                        isSuccess={isSuccess}
                        error={error}
                    />
                )}
                {isSuccess && (
                    <button onClick={onClose} className="mt-4 w-full py-2.5 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: P }}>
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookingForm;
