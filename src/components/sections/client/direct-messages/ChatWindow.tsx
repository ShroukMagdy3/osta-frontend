"use client";

import { useEffect, useRef } from "react";
import { Room } from "@/types/chat.types";
import { useChat } from "@/hooks/useChat";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket | null;
  room: Room | null;
  currentUserId: string;
  onHistoryLoaded?: () => void;
  /** بيظهر زرار رجوع على الموبايل بس، بيرجع لقائمة المحادثات */
  onBack?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function groupByDate(messages: ReturnType<typeof useChat>["messages"]) {
  const groups: { date: string; messages: typeof messages }[] = [];
  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString("ar-EG", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const last = groups[groups.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      groups.push({ date, messages: [msg] });
    }
  });
  return groups;
}

export default function ChatWindow({
  socket,
  room,
  currentUserId,
  onHistoryLoaded,
  onBack,
}: Props) {
  const {
    messages,
    isLoadingHistory,
    isClosed,
    isSending,
    sendMessage,
    error,
    retryHistory,
  } = useChat({
    socket,
    room,
    currentUserId,
    onHistoryLoaded,
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#9AA6A1] text-sm">
        اختر محادثة لبدء المراسلة
      </div>
    );
  }

  const grouped = groupByDate(messages);
  const initials = getInitials(room.otherPartyName);

  return (
    // 🔧 min-h-0 يخلي العمود ده يقدر يتقلص جوه الأب بتاعه
    // بدل ما يكبر على قد المحتوى ويدفع الإنپوت برا الشاشة
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3.5 border-b border-[#EEF1EF] flex-shrink-0">
        {/* زرار الرجوع — يظهر على الموبايل بس */}
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="رجوع لقائمة المحادثات"
            className="lg:hidden w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-[#F4F6F4] transition-all"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1C4B41"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* RTL: السهم بيرجع لليمين */}
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        ) : null}

        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E8F8BA] text-[#3F6B2C] flex items-center justify-center text-xs sm:text-sm font-semibold">
            {initials}
          </div>
          {room.isOnline && (
            <span className="absolute bottom-0 left-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#6B8B0E1F] border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold text-[#112D27] truncate">
            {room.otherPartyName}
          </p>
          <p className="text-[10px] sm:text-xs text-[#7C8B85] mt-0.5 truncate">
            {room.title}
          </p>
        </div>

        {isClosed && (
          <span className="text-[10px] sm:text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
            تم إغلاق المحادثة
          </span>
        )}
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#FBF6E9] border-b border-[#F3ECD6] flex-shrink-0">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A227"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className="text-[10px] sm:text-xs text-[#8A7327]">
          للحفاظ على أمانك، لا تشارك أرقام الهاتف أو وسائل تواصل خارجية. تتم
          مراجعة المحادثات.
        </p>
      </div>

      {/* Messages */}
      {/* 🔧 min-h-0 هنا هو أهم حاجة في الفكس — flex-1 لوحده مش كافي عشان
          الديف يعمل scroll جوّاه بدل ما يكبر ويدفع باقي العناصر برا الشاشة */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 flex flex-col gap-3 bg-[#FCFDFC]"
      >
        {isLoadingHistory ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#7CB342] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error && messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 sm:px-6 py-8 sm:py-12 text-center">
            <p className="text-xs sm:text-sm text-[#A05A5A]">{error}</p>
            {retryHistory ? (
              <button
                type="button"
                onClick={retryHistory}
                className="text-xs text-[#1C4B41] hover:underline"
              >
                إعادة المحاولة
              </button>
            ) : null}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-8 sm:py-12">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">لا توجد رسائل بعد</p>
            <p className="text-[10px] sm:text-xs text-gray-300">ابدأ المحادثة الآن</p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.date} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 my-1">
                <div className="flex-1 h-px bg-[#EEF1EF]" />
                <span className="text-[10px] text-[#9AA6A1] px-2 flex-shrink-0">
                  {group.date}
                </span>
                <div className="flex-1 h-px bg-[#EEF1EF]" />
              </div>
              {group.messages.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {isClosed ? (
        <div className="px-3 sm:px-5 py-3 sm:py-3.5 bg-[#FAFBFA] border-t border-[#EEF1EF] text-center flex-shrink-0">
          <p className="text-[10px] sm:text-xs text-[#9AA6A1]">
            تم إغلاق هذه المحادثة بعد اكتمال الطلب أو إلغائه.
          </p>
        </div>
      ) : (
        <div className="flex flex-shrink-0 flex-col">
          {error && messages.length > 0 ? (
            <div className="px-3 sm:px-5 pt-3 text-xs text-[#A05A5A]">{error}</div>
          ) : null}
          <ChatInput onSend={sendMessage} disabled={isClosed || isSending} />
        </div>
      )}
    </div>
  );
}