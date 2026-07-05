"use client";

import { useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface Props {
  input: string;
  loading: boolean;
  isOpen: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatInput({
  input,
  loading,
  isOpen,
  onChange,
  onSend,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  return (
    <div className="shrink-0 px-4 pb-5 pt-5  border-t-1 border-[var(--primary-color)]/40">
      <div
        className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 shadow-sm border border-[var(--primary-color)]/30"
        dir="ltr"
      >
        <button
          onClick={onSend}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-full bg-[var(--accent-color)] flex items-center justify-center shrink-0 hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40"
        >
          <ArrowLeft size={16} className="text-[var(--primary-color)]" />
        </button>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="صف مشكلتك هنا..."
          className="flex-1 bg-transparent text-sm text-right outline-none placeholder:text-gray-400"
          dir="rtl"
        />
      </div>
      <p className="text-center text-[11px] text-gray-400 mt-2">
        مدعوم بالذكاء الاصطناعي · أوسطى AI
      </p>
    </div>
  );
}
