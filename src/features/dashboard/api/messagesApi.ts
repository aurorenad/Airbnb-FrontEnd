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
