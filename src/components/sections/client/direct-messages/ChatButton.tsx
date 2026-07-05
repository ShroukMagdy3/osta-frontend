"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { chatService } from "@/api/services/chat.service";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

interface Props {
  requestId?: string;
  customChat?: {
    postId: string;
    technicianId?: string;
    title?: string;
    clientName?: string;
  };
  role: "client" | "technician";
}

export default function ChatButton({ requestId, customChat, role }: Props) {
  const [unread, setUnread] = useState(0);
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    if (!requestId || customChat) {
      return;
    }

    chatService
      .getUnreadCount(requestId)
      .then(setUnread)
      .catch(() => setUnread(0));
  }, [customChat, requestId]);

  const href = customChat
    ? `/${role}/direct-messages?${new URLSearchParams({
        postId: customChat.postId,
        technicianId: customChat.technicianId ?? userId ?? "",
        title: customChat.title ?? "خدمة مخصصة",
        clientName: customChat.clientName ?? "العميل",
      }).toString()}`
    : `/${role}/direct-messages?requestId=${requestId}`;

  return (
    <Button
      variant="outline"
      className="!relative !border-[#EAE9E3] !px-3 !text-xs !font-medium !text-[#636261] !hover:bg-[#F8FAF9]"
      onClick={() => router.push(href)}
    >
      <span className="inline-flex items-center gap-2">
        <MessageCircle size={12} className="text-[#8B908D]" />
        محادثة
        {unread > 0 ? (
          <span className="absolute -left-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </span>
    </Button>
  );
}
