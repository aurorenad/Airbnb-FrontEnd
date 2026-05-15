import api from "../../../lib/axios";

// ── Types ──────────────────────────────────────────────────────────────────

export interface AiSearchFilters {
  location: string | null;
  type: string | null;
  maxPrice: number | null;
  guests: number | null;
}

export interface AiSearchResponse {
  filters: AiSearchFilters;
  data: unknown[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiChatResponse {
  response: string;
  sessionId: string;
  messageCount: number;
}

export interface ReviewSummaryResponse {
  summary: string;
  positives: string[];
  negatives: string[];
  averageRating: number;
  totalReviews: number;
}

export interface RecommendationResponse {
  preferences: string;
  reason: string;
  searchFilters: AiSearchFilters;
  recommendations: unknown[];
}

// ── API calls ──────────────────────────────────────────────────────────────

export const aiSearchListings = async (
  query: string,
  page = 1,
  limit = 10
): Promise<AiSearchResponse> => {
  const { data } = await api.post<AiSearchResponse>(
    "/ai/search",
    { query },
    { params: { page, limit } }
  );
  return data;
};

export const sendAiChatMessage = async (
  sessionId: string,
  message: string,
  listingId?: string
): Promise<AiChatResponse> => {
  const { data } = await api.post<AiChatResponse>("/ai/chat", {
    sessionId,
    message,
    listingId,
  });
  return data;
};

export const fetchReviewSummary = async (
  listingId: string
): Promise<ReviewSummaryResponse> => {
  const { data } = await api.get<ReviewSummaryResponse>(
    `/ai/listings/${listingId}/reviews/summary`
  );
  return data;
};

export const fetchAiRecommendations = async (): Promise<RecommendationResponse> => {
  const { data } = await api.get<RecommendationResponse>("/ai/recommendations");
  return data;
};

export const generateDescription = async (
  listingId: string,
  tone: "professional" | "casual" | "luxury" = "professional"
): Promise<{ description: string }> => {
  const { data } = await api.post<{ description: string }>(
    `/ai/generate-description/${listingId}`,
    { tone }
  );
  return data;
};