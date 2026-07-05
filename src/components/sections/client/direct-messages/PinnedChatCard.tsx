"use client";

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { ChevronUp } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { Room } from "@/types/chat.types";
import MessageBubble from "@/components/sections/client/direct-messages/MessageBubble";
import ChatInput from "@/components/sections/client/direct-messages/ChatInput";

interface Props {
  requestId: string;
  otherPartyName: string;
  serviceTitle: string;
  currentUserId: string;
  socket: Socket | null;
}

const COLORS = {
  primary: "#1C4B41",
  accent: "#B3E718",
};

function getInitial(name: string) {
  return name.charAt(0) || "؟";
}

/**
 * Card ثابت في نص الشاشة عموديًا (Client + Technician).
 * - الحالة المقفولة: بيعرض اسم الطرف الآخر + آخر رسالة (preview)
 * - بالضغط: بيتمدد نفس الـ card لشات صغير (mini) فيه آخر الرسائل + input
 *   بدل ما يفتح صفحة أو modal منفصل تمامًا.
 */
export default function PinnedChatCard({
  requestId,
  otherPartyName,
  serviceTitle,
  currentUserId,
  socket,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const room: Room = {
    id: requestId,
    variant: "fixed",
    requestId,
    otherPartyName,
    initials: getInitial(otherPartyName),
    title: serviceTitle,
    unreadCount: 0,
  };

  const { messages, isLoadingHistory, isClosed, isSending, sendMessage } =
    useChat({
      socket,
      room,
      currentUserId,
    });

  const lastMessage = messages[messages.length - 1] ?? null;

  const unreadCount = messages.filter(
    (msg) =>
      typeof msg.senderId === "string"
        ? msg.senderId !== currentUserId
        : msg.senderId._id !== currentUserId,
    // isRead: false — بيتصفر لما تفتحي الكارد لأن useChat بيعمل markAsRead أوتوماتيك
  ).filter((msg) => !msg.isRead).length;

  useEffect(() => {
    if (!isExpanded) return;
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isExpanded]);

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 right-4 z-50 w-[min(320px,calc(100vw-1rem))] overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(17,45,39,0.14)] sm:bottom-10 sm:right-6"
      style={{ maxHeight: isExpanded ? "440px" : "auto" }}
    >
      {/* الجزء الثابت اللي بيبان دايمًا — الكارد نفسه */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3"
      >
        <span className="relative flex-shrink-0">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
          >
            {getInitial(otherPartyName)}
          </span>
          {!isExpanded && unreadCount > 0 && (
            <span className="absolute -top-1 -left-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1 text-right">
          <p
            className="truncate text-sm font-bold"
            style={{ color: COLORS.primary }}
          >
            {otherPartyName}
          </p>
          <p className="truncate text-xs text-gray-400">
            {lastMessage ? lastMessage.content : "ابدأ المحادثة الآن…"}
          </p>
        </div>

        <ChevronUp
          className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* الجزء اللي بيظهر بس لما تفتحي الكارد — شات mini */}
      {isExpanded && (
        <div className="flex h-[340px] flex-col border-t border-[#EEF1EF]">
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 bg-[#FCFDFC]">
            {isLoadingHistory ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#7CB342] border-t-transparent" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
                <p className="text-xs text-gray-400">لا توجد رسائل بعد</p>
                <p className="text-[11px] text-gray-300">ابدأ المحادثة الآن</p>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  currentUserId={currentUserId}
                />
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {isClosed ? (
            <div className="border-t border-[#EEF1EF] bg-[#FAFBFA] px-4 py-2.5 text-center">
              <p className="text-[11px] text-[#9AA6A1]">
                تم إغلاق هذه المحادثة.
              </p>
            </div>
          ) : (
            <ChatInput onSend={sendMessage} disabled={isSending} />
          )}
        </div>
      )}
    </div>
  );
}
