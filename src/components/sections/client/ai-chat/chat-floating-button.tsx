"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/api/axios";
import { SparkleSvg, QUICK_CHIPS } from "./ChatBubbles";
import { ChatMessage } from "./ChatMessages";
import ChatModal from "./ChatModal";

export default function ChatFloatingButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "ai",
      text: "أهلًا بك في أُوسطى! 👋 أنا مساعدك الذكي، أخبرني عن مشكلتك وسأساعدك في إيجاد الأوسطى المناسب.",
      chips: QUICK_CHIPS,
    },
  ]);

  const msgId = useRef(2);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const addMsg = (msg: Omit<ChatMessage, "id">) =>
    setMessages((prev) => [...prev, { ...msg, id: msgId.current++ }]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // Handle "أنا بخير شكراً" — close gracefully without API call
    if (text.includes("أنا بخير")) {
      addMsg({ role: "user", text });
      setTimeout(() => {
        addMsg({
          role: "ai",
          text: "يسعدنا ذلك! 😊 إذا احتجت أي مساعدة في المستقبل أنا هنا.",
        });
      }, 400);
      return;
    }

    addMsg({ role: "user", text });
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", {
        message: text,
        conversationId,
      });
      const res = data.data;

      // Persist conversation ID
      if (res.conversationId && !conversationId) {
        setConversationId(res.conversationId);
      }

      // ── Emergency ──────────────────────────────────────────────────────────
      // ONE message: emergency bubble with dynamic tips inside
      if (res.emergency === true || res.isEmergency === true) {
        addMsg({
          role: "ai",
          emergencyData: {
            type: res.type,
            severity: res.severity ?? "عالية",
            contacts: res.contacts ?? {},
            tips: res.tips ?? [],   // dynamic tips from backend
          },
        });
        return;
      }

      // ── Out of scope ───────────────────────────────────────────────────────
      if (res.outOfScope === true) {
        addMsg({ role: "ai", isOutOfScope: true });
        return;
      }

      // ── Clarification needed ───────────────────────────────────────────────
      if (res.needsClarification && res.question) {
        addMsg({
          role: "ai",
          text: res.question,
          isClarification: true,
        });
        return;
      }

      // ── Normal flow — ALL in ONE message ───────────────────────────────────
      // Order: tip → service card (or no-service) → AI question/message → follow-up chips
      addMsg({
        role: "ai",
        tip: res.tip,
        serviceCard: res.service
          ? {
              _id: res.service._id,
              name: res.service.name,
              image: res.service.image,
              rating: res.service.averageRating ?? 4.5,
              category: res.category,
              priceRange: res.service.priceRange,
              fixingSteps: res.service.fixingSteps,
            }
          : undefined,
        isNoService: !res.service && !!res.category,
        text: res.message,   // AI question / conversational reply
        showFollowUp: true,
      });

    } catch {
      addMsg({ role: "ai", text: "حدث خطأ في الاتصال. حاول مجدداً." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="افتح المساعد الذكي"
        className="fixed bottom-10 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-[var(--primary-color)] shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200 flex items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-[var(--primary-color)] animate-ping opacity-25" />
        <span className="relative z-10">
          <SparkleSvg size={26} />
        </span>
      </button>

      {open && (
        <ChatModal
          messages={messages}
          loading={loading}
          input={input}
          onClose={() => setOpen(false)}
          onSendMessage={sendMessage}
          onInputChange={setInput}
        />
      )}
    </>
  );
}