"use client";

import { useRef, useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { WrenchSvg } from "./TechCompanionBubbles";
import TechCompanionSidebar from "./TechCompanionSidebar";
import TechCompanionMessages, { TechMessage } from "./TechCompanionMessages";

interface Props {
  messages: TechMessage[];
  loading: boolean;
  chips: string[];
  onClose: () => void;
  onSendMessage: (text: string) => void;
}

export default function TechCompanionModal({
  messages,
  loading,
  chips,
  onClose,
  onSendMessage,
}: Props) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl shadow-2xl"
        style={{ background: "#1C4B41" }}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* ── Header (mirrors client ChatModal header exactly) ── */}
        <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">
          {/* Left: accent wrench button */}
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-color)] flex items-center justify-center">
            <WrenchSvg size={20} color="#1C4B41" />
          </div>

          {/* Center */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-hover)] to-[var(--primary-color)] flex items-center justify-center shrink-0">
              <WrenchSvg size={18} color="#B3E718" />
            </div>
            <div className="text-right">
              <p className="font-bold text-white text-sm leading-tight">
                TechCompanion
              </p>
              <p className="text-[11px] text-[var(--accent-color)] flex items-center gap-1 justify-end mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] inline-block" />
                مساعد أوسطى AI للفنيين
              </p>
            </div>
          </div>

          {/* Right: close */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* ── Body (sidebar + white chat panel — mirrors client exactly) ── */}
        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          <TechCompanionSidebar chips={chips} onSendMessage={onSendMessage} />

          {/* White chat panel */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-tr-3xl bg-white">
            <TechCompanionMessages messages={messages} loading={loading} />

            {/* Input — mirrors client ChatInput */}
            <div className="shrink-0 px-4 pb-5 pt-5 border-t-1 border-[var(--primary-color)]/40">
              <div
                className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 shadow-sm border border-[var(--primary-color)]/30"
                dir="ltr"
              >
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-full bg-[var(--accent-color)] flex items-center justify-center shrink-0 hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40"
                >
                  <ArrowLeft size={16} className="text-[var(--primary-color)]" />
                </button>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="اسألني عن أي عطل أو جدولك اليوم..."
                  className="flex-1 bg-transparent text-sm text-right outline-none placeholder:text-gray-400"
                  dir="rtl"
                />
              </div>
              <p className="text-center text-[11px] text-gray-400 mt-2">
                مدعوم بالذكاء الاصطناعي · TechCompanion by أوسطى
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}