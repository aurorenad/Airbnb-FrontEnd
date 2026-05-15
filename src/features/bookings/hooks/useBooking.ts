import { useState, useMemo } from "react";
import axios from "axios";
import api from "../../../lib/axios";
import { useAuth } from "../../auth/hooks/useAuth";
import type { DatesData, PersonalData, PaymentData } from "../schemas/booking";
import type { ListingId } from "../../listings/types";

interface BookingAccumulated {
  dates?: DatesData;
  personal?: PersonalData;
  payment?: PaymentData;
}

export const useBooking = (listingId: ListingId) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<BookingAccumulated>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultPersonal = useMemo<Partial<PersonalData>>(() => {
    if (!user) return {};
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  }, [user]);

  const next = (stepData: DatesData | PersonalData | PaymentData) => {
    if (currentStep === 0) setData((p) => ({ ...p, dates: stepData as DatesData }));
    if (currentStep === 1) {
      const personalData = { ...defaultPersonal, ...(stepData as PersonalData) };
      setData((p) => ({ ...p, personal: personalData as PersonalData }));
    }
    if (currentStep === 2) setData((p) => ({ ...p, payment: stepData as PaymentData }));
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!data.dates || !data.personal || !data.payment) return;
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("Please log in before booking.");
      }

      await api.post("/bookings", {
        listingId,
        checkIn: new Date(`${data.dates.checkIn}T12:00:00`).toISOString(),
        checkOut: new Date(`${data.dates.checkOut}T12:00:00`).toISOString(),
        guests: data.dates.guests,
      });
      setIsSuccess(true);
    } catch (e) {
      const message = axios.isAxiosError(e)
        ? e.response?.data?.message ?? "Booking failed. Please try again."
        : e instanceof Error ? e.message : "Booking failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { currentStep, data, next, back, submit, isSubmitting, isSuccess, error, defaultPersonal };
};
