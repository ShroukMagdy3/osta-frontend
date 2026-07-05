"use client";

import { X } from "lucide-react";
import { SparkleSvg } from "./ChatBubbles";
import ChatSidebar from "./ChatSidebar";
import ChatMessages from "./ChatMessages";
import { ChatMessage } from "./ChatMessages";
import ChatInput from "./ChatInput";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  input: string;
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onInputChange: (value: string) => void;
}

export default function ChatModal({
  messages,
  loading,
  input,
  onClose,
  onSendMessage,
  onInputChange,
}: Props) {
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
        {/* ── Header ── */}
        <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">
          {/* Left: accent sparkle button */}
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-color)] flex items-center justify-center">
            <SparkleSvg size={20} color="#1C4B41" />
          </div>

        
          {/* Center */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-hover)] to-[var(--primary-color)] flex items-center justify-center shrink-0">
              <SparkleSvg size={18} color="#1C4B41" />
            </div>
            <div className="text-right">
              <p className="font-bold text-white text-sm leading-tight">
                الطلب الذكي
              </p>
              <p className="text-[11px] text-[var(--accent-color)] flex items-center gap-1 justify-end mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] inline-block" />
                مساعد أوسطى AI
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

        {/* ── Body ── */}
        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          <ChatSidebar onSendMessage={onSendMessage} />

          {/* ── Chat (white) ── */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-tr-3xl bg-white">
            <ChatMessages
              messages={messages}
              loading={loading}
              onSendMessage={onSendMessage}
              onClose={onClose}
            />
            <ChatInput
              input={input}
              loading={loading}
              isOpen={true}
              onChange={onInputChange}
              onSend={() => onSendMessage(input)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
