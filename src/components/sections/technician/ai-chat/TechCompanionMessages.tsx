"use client";

import { useRef, useEffect } from "react";
import { TechAiLabel, TechOutOfScopeBubble } from "./TechCompanionBubbles";

export interface TechMessage {
  id: number;
  role: "ai" | "user";
  text?: string;
  isOutOfScope?: boolean;
}

interface Props {
  messages: TechMessage[];
  loading: boolean;
}

export default function TechCompanionMessages({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div
      className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar"
      dir="ltr"
    >
      {messages.map((msg) =>
        msg.role === "ai" ? (
          <div key={msg.id}>
            <TechAiLabel />
            <div className="flex flex-col gap-2.5 items-end">
              {msg.isOutOfScope ? (
                <TechOutOfScopeBubble />
              ) : msg.text ? (
                <div
                  className="bg-gray-50 border shadow-sm border-gray-100 rounded-2xl rounded-tr-none px-4 py-3 text-sm text-gray-700 leading-7 text-right max-w-[82%] whitespace-pre-wrap"
                  dir="rtl"
                >
                  {msg.text}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div key={msg.id} className="flex justify-start">
            <div
              className="bg-[var(--primary-color)] text-white rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-7 max-w-[75%] text-right"
              dir="rtl"
            >
              {msg.text}
            </div>
          </div>
        ),
      )}

      {loading && (
        <div>
          <TechAiLabel />
          <div className="flex justify-end">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tr-none px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
