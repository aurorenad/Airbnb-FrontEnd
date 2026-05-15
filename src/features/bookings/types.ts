import type { DatesData, PersonalData, PaymentData } from "./schemas/booking";

export type { DatesData, PersonalData, PaymentData };

export interface BookingState {
    currentStep: number;
    dates: Partial<DatesData>;
    personal: Partial<PersonalData>;
    payment: Partial<PaymentData>;
}
