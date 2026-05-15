import api from "../../../lib/axios";

export type ApiBookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface DashboardBooking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: ApiBookingStatus;
  guest?: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string | null;
  };
  listing: {
    id: string;
    title: string;
    location: string;
    pricePerNight?: number;
    photos?: { url: string }[];
  };
}

export const fetchMyBookings = async () => {
  const { data } = await api.get<DashboardBooking[]>("/bookings/my");
  return data;
};

export const fetchHostBookings = async () => {
  const { data } = await api.get<DashboardBooking[]>("/bookings/host");
  return data;
};

export const approveBooking = async (id: string) => {
  const { data } = await api.patch<DashboardBooking>(`/bookings/${id}/approve`);
  return data;
};

export const cancelBooking = async (id: string) => {
  await api.delete(`/bookings/${id}`);
};
