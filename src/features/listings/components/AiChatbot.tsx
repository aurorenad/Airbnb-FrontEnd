import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { sendAiChatMessage, type ChatMessage } from "../api/aiApi";
import { useParams } from "react-router-dom";
import { useListing } from "../hooks/useListing";

const makeSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const P = "#e8441a";
const P_LIGHT = "#fdf1ee";

interface AiChatbotInnerProps {
  listingId?: string;
  listingTitle?: string;
}

const AiChatbotInner = ({ listingId, listingTitle }: AiChatbotInnerProps) => {
  // Greeting is computed once at init — no setState in effect needed
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content: listingTitle
        ? `Hi! 👋 I'm your AI assistant for **${listingTitle}**. Ask me anything about this listing — amenities, availability, location tips, and more!`
        : "Hi! 👋 I'm your AI assistant. How can I help you find the perfect place?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(makeSessionId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendAiChatMessage(sessionId, text, listingId);
      setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I ran into an issue. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId, listingId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = listingId
    ? ["What amenities are included?", "Is parking available?", "How far is the city centre?"]
    : ["Find me an apartment in Kigali", "What villas are available?", "Houses under $150/night"];

  const hasUserMessage = messages.some((m) => m.role === "user");

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI chat assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ backgroundColor: P }}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: P }} />
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"
        }`}
        style={{ height: "520px", backgroundColor: "#fff" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ backgroundColor: P }}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight">AI Assistant</p>
            <p className="text-white/70 text-xs truncate">
              {listingTitle ? `Helping with: ${listingTitle}` : "Ask me anything"}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ backgroundColor: "#fafaf9" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                style={{ backgroundColor: msg.role === "assistant" ? P_LIGHT : "#e2e8f0" }}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-4 h-4" style={{ color: P }} />
                ) : (
                  <User className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "text-white rounded-tr-sm"
                    : "text-slate-700 rounded-tl-sm border border-slate-100"
                }`}
                style={{ backgroundColor: msg.role === "user" ? P : "#fff" }}
              >
                {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={j}>{part.slice(2, -2)}</strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2">
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                style={{ backgroundColor: P_LIGHT }}
              >
                <Bot className="w-4 h-4" style={{ color: P }} />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-100 bg-white">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {!hasUserMessage && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0" style={{ backgroundColor: "#fafaf9" }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                  inputRef.current?.focus();
                }}
                className="text-xs px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 pb-3 pt-2 shrink-0 border-t border-slate-100 bg-white">
          <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything…"
              className="flex-1 resize-none bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
              style={{ maxHeight: 80 }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: P }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-300 mt-1.5">Powered by AI · Press Enter to send</p>
        </div>
      </div>
    </>
  );
};

// Wrapper: auto-detects listing context from URL params
const AiChatbot = () => {
  const { id } = useParams<{ id?: string }>();
  const { data: listing } = useListing(id);
  return <AiChatbotInner listingId={id} listingTitle={listing?.title} />;
};

export default AiChatbot;