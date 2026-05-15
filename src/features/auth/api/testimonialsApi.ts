import api from "../../../lib/axios";

export interface Testimonial {
  id: string;
  quote: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export const fetchTestimonials = async () => {
  const { data } = await api.get<{ data: Testimonial[] }>("/reviews/testimonials");
  return data.data;
};

export const createTestimonial = async (quote: string) => {
  const { data } = await api.post<Testimonial>("/reviews/testimonials", { quote });
  return data;
};
