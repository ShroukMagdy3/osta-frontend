"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AiLabel,
  ServiceCardBubble,
  EmergencyBubble,
  NoServiceBubble,
  TipPill,
  FollowUpChipsBubble,
  OutOfScopeBubble,
  ServiceCard,
  EmergencyData,
} from "./ChatBubbles";

export interface ChatMessage {
  id: number;
  role: "ai" | "user";
  text?: string;
  chips?: string[];
  tip?: string;
  serviceCard?: ServiceCard;
  emergencyData?: EmergencyData;
  isNoService?: boolean;
  isClarification?: boolean;
  isOutOfScope?: boolean;
  showFollowUp?: boolean;
}

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

export default function ChatMessages({
  messages,
  loading,
  onSendMessage,
  onClose,
}: Props) {
  const router = useRouter();
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
            {/* ONE label per AI turn */}
            <AiLabel />

            <div className="flex flex-col gap-2.5 items-end">
              {/* 1. Tip pill — first */}
              {msg.tip && <TipPill tip={msg.tip} />}

              {/* 2. Service card */}
              {msg.serviceCard && (
                <ServiceCardBubble
                  card={msg.serviceCard}
                  onRequest={(id) => {
                    onClose();
                    router.push(`/client/services/${id}`);
                  }}
                />
              )}

              {/* 3. No-service card */}
              {msg.isNoService && (
                <NoServiceBubble
                  onBrowse={() => {
                    onClose();
                    router.push("/categories");
                  }}
                />
              )}

              {/* 4. Emergency */}
              {msg.emergencyData && (
                <EmergencyBubble data={msg.emergencyData} />
              )}

              {/* 5. Conversational AI reply / question — after card */}
              {msg.text && !msg.isClarification && !msg.isOutOfScope && (
                <div className="bg-gray-50 border shadow-sm border-gray-100 rounded-2xl rounded-tr-none px-4 py-3 text-sm text-gray-700 leading-7 text-right max-w-[82%]">
                  {msg.text}
                </div>
              )}

              {/* 6. Clarification bubble */}
              {msg.isClarification && msg.text && (
                <div className="bg-blue-50 border border-blue-100 shadow-sm rounded-2xl rounded-tr-none px-4 py-3 text-sm text-blue-800 leading-7 text-right max-w-[82%]">
                  <p className="text-[11px] font-bold text-blue-400 mb-1">
                    محتاج معلومة إضافية 🤔
                  </p>
                  {msg.text}
                </div>
              )}

              {/* 7. Out of scope */}
              {msg.isOutOfScope && <OutOfScopeBubble />}

              {/* 8. Welcome chips */}
              {msg.chips && (
                <div className="flex flex-wrap gap-2 justify-end max-w-[90%]">
                  {msg.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => onSendMessage(chip)}
                      className="bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 rounded-full px-3.5 py-1.5 text-xs text-gray-700 hover:border-[var(--accent-hover)] hover:text-[var(--primary-color)] hover:bg-[var(--accent-hover)] transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* 9. Follow-up chips — always last */}
              {msg.showFollowUp && (
                <FollowUpChipsBubble onSelect={onSendMessage} />
              )}
            </div>
          </div>
        ) : (
          <div key={msg.id} className="flex justify-start">
            <div className="bg-[var(--primary-color)] text-white rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-7 max-w-[75%] text-right">
              {msg.text}
            </div>
          </div>
        ),
      )}

      {/* Typing dots */}
      {loading && (
        <div>
          <AiLabel />
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
