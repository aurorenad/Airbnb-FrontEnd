import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, Send } from "lucide-react";
import toast from "react-hot-toast";
import { fetchConversations, fetchMessages, sendMessage } from "../api/messagesApi";
import { useAuth } from "../../auth/hooks/useAuth";

const P = "#e8441a";
const BG = "#f7f3ef";

const initials = (name?: string) => (name || "U").slice(0, 1).toUpperCase();

const MessagePage = () => {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(params.get("user"));
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversationsQuery = useQuery({ queryKey: ["conversations"], queryFn: fetchConversations });
  const messagesQuery = useQuery({
    queryKey: ["messages", activeId],
    queryFn: () => fetchMessages(activeId as string),
    enabled: !!activeId,
  });

  useEffect(() => {
    const userId = params.get("user");
    if (userId) {
      setActiveId(userId);
      setMobileView("chat");
    }
  }, [params]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesQuery.data?.length]);

  const sendMutation = useMutation({
    mutationFn: () => {
      if (!activeId) throw new Error("Choose a conversation first");
      return sendMessage(activeId, input);
    },
    onSuccess: async () => {
      setInput("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["messages", activeId] }),
        queryClient.invalidateQueries({ queryKey: ["conversations"] }),
      ]);
    },
    onError: () => toast.error("Failed to send message"),
  });

  const conversations = useMemo(() => {
    const term = search.toLowerCase();
    return (conversationsQuery.data ?? []).filter((conversation) =>
      conversation.partner.name.toLowerCase().includes(term)
    );
  }, [conversationsQuery.data, search]);

  const activePartner =
    conversations.find((conversation) => conversation.partner.id === activeId)?.partner ??
    messagesQuery.data?.find((message) => message.senderId === activeId || message.receiverId === activeId)?.sender;

  const openChat = (id: string) => {
    setActiveId(id);
    setMobileView("chat");
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] rounded-lg overflow-hidden border border-black/5 shadow-sm" style={{ backgroundColor: BG }}>
      <div className={`${mobileView === "chat" ? "hidden" : "flex"} md:flex flex-col w-full md:w-80 border-r border-black/10 shrink-0`} style={{ backgroundColor: BG }}>
        <div className="p-4 border-b border-black/10">
          <h2 className="font-bold text-slate-900 mb-3">Messages</h2>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 border border-black/5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations"
              className="bg-transparent text-sm focus:outline-none text-slate-700 placeholder:text-slate-400 w-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversationsQuery.isLoading && <div className="p-4 text-sm text-slate-500">Loading conversations...</div>}
          {!conversationsQuery.isLoading && conversations.length === 0 && (
            <div className="p-4 text-sm text-slate-500">No database conversations yet.</div>
          )}
          {conversations.map((conversation) => (
            <button
              key={conversation.partner.id}
              onClick={() => openChat(conversation.partner.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-black/5 ${activeId === conversation.partner.id ? "bg-black/5" : ""}`}
            >
              {conversation.partner.avatar ? (
                <img src={conversation.partner.avatar} alt={conversation.partner.name} className="w-11 h-11 rounded-full object-cover" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                  {initials(conversation.partner.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900 truncate">{conversation.partner.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-xs text-slate-400 truncate">{conversation.lastMessage.content}</span>
                  {conversation.unread > 0 && (
                    <span className="text-[10px] font-bold text-white rounded-full min-w-4 h-4 px-1 flex items-center justify-center shrink-0 ml-1" style={{ backgroundColor: P }}>
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeId ? (
        <div className={`${mobileView === "list" ? "hidden" : "flex"} md:flex flex-1 flex-col min-w-0`}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10" style={{ backgroundColor: BG }}>
            <button onClick={() => setMobileView("list")} className="md:hidden p-1 text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
              {initials(activePartner?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-900">{activePartner?.name ?? "New conversation"}</p>
              <p className="text-xs text-slate-500">{activePartner?.role ?? "User"}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ backgroundColor: "#ede8e3" }}>
            {messagesQuery.isLoading && <div className="text-sm text-slate-500">Loading messages...</div>}
            {(messagesQuery.data ?? []).map((message) => {
              const mine = message.senderId === user?.id;
              return (
                <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${mine ? "text-white rounded-br-sm" : "bg-white text-slate-800 rounded-bl-sm"}`}
                    style={mine ? { backgroundColor: P } : {}}
                  >
                    <p>{message.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${mine ? "text-white/70" : "text-slate-400"}`}>
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 border-t border-black/10 flex items-center gap-3" style={{ backgroundColor: BG }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && input.trim() && sendMutation.mutate()}
              placeholder="Type a message"
              className="flex-1 bg-white/70 border border-black/5 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-700 placeholder:text-slate-400"
            />
            <button
              onClick={() => sendMutation.mutate()}
              disabled={!input.trim() || sendMutation.isPending}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-opacity disabled:opacity-40 hover:opacity-90 shrink-0"
              style={{ backgroundColor: P }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center flex-col gap-3 text-slate-400">
          <Send className="w-8 h-8 text-slate-300" />
          <p className="font-medium text-slate-500">Select a conversation</p>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
