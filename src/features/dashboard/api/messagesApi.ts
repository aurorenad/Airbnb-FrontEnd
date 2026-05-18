import api from "../../../lib/axios";

export interface MessageUser {
  id: string;
  name: string;
  avatar: string | null;
  role?: string;
}

export interface ApiMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  sender: MessageUser;
  receiver: MessageUser;
}

export interface Conversation {
  partner: MessageUser;
  lastMessage: ApiMessage;
  unread: number;
}

export const fetchConversations = async () => {
  const { data } = await api.get<Conversation[]>("/messages/conversations");
  return data;
};

export const fetchMessages = async (partnerId: string) => {
  const { data } = await api.get<ApiMessage[]>(`/messages/${partnerId}`);
  return data;
};

export const sendMessage = async (receiverId: string, content: string) => {
  const { data } = await api.post<ApiMessage>("/messages", { receiverId, content });
  return data;
};

// Support: guest/host sends a message to the support inbox (any admin)
// The backend should route this to a special "support" user or admin pool.
// We use receiverId: "support" and let the backend resolve to an available admin.
export const sendSupportMessage = async (content: string) => {
  const { data } = await api.post<ApiMessage>("/messages/support", { content });
  return data;
};

export const fetchSupportMessages = async () => {
  const { data } = await api.get<ApiMessage[]>("/messages/support");
  return data;
};

// Admin: fetch all support conversations across all users
export const fetchAllSupportConversations = async () => {
  const { data } = await api.get<Conversation[]>("/messages/support/conversations");
  return data;
};