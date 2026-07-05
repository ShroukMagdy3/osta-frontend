"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/api/axios";
import { WrenchSvg } from "./TechCompanionBubbles";
import TechCompanionModal from "./TechCompanionModal";
import { TechMessage } from "./TechCompanionMessages";

const WELCOME_MESSAGE =
  "أهلاً! 👋 أنا TechCompanion، مساعدك الذكي.\n\nيمكنني مساعدتك في:\n• الأسئلة التقنية في مجال تخصصك\n• الاطلاع على جدولك ومواعيدك اليومية\n\nاسألني بحرية!";

export default function TechCompanionButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined,
  );
  const [messages, setMessages] = useState<TechMessage[]>([
    { id: 1, role: "ai", text: WELCOME_MESSAGE },
  ]);

  const msgId = useRef(2);

  // Fetch dynamic chips on mount
  useEffect(() => {
    api
      .get("/tech-companion/chips")
      .then(({ data }) => {
        // interceptor wraps: data.data is the array
        const arr = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        setChips(arr);
      })
      .catch(() => {
        setChips(["ما جدولي اليوم؟", "هل عندي طلبات الغد؟"]);
      });
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const addMsg = (msg: Omit<TechMessage, "id">) =>
    setMessages((prev) => [...prev, { ...msg, id: msgId.current++ }]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    addMsg({ role: "user", text });
    setLoading(true);

    try {
      const { data } = await api.post("/tech-companion", {
        message: text,
        conversationId,
      });

      // Response interceptor wraps to: { success, message, data: <payload> }
      // Our service returns { conversationId, outOfScope, message }
      // After interceptor: data.data = { conversationId, outOfScope, message }
      const res = data.data ?? data;

      if (res.conversationId && !conversationId) {
        setConversationId(res.conversationId);
      }

      if (res.outOfScope) {
        addMsg({ role: "ai", isOutOfScope: true });
      } else {
        addMsg({ role: "ai", text: res.message });
      }
    } catch {
      addMsg({
        role: "ai",
        text: "حدث خطأ في الاتصال. تأكد من تسجيل الدخول وحاول مجدداً.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="افتح TechCompanion"
        className="fixed bottom-10 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-[var(--primary-color)] shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200 flex items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-[var(--primary-color)] animate-ping opacity-25" />
        <span className="relative z-10">
          <WrenchSvg size={24} color="white" />
        </span>
      </button>

      {open && (
        <TechCompanionModal
          messages={messages}
          loading={loading}
          chips={chips}
          onClose={() => setOpen(false)}
          onSendMessage={sendMessage}
        />
      )}
    </>
  );
}
