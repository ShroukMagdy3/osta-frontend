"use client";

import { useRouter } from "next/navigation";
import { Ticket, MessageCircle, HelpCircle } from "lucide-react";

interface SupportMenuPanelProps {
  /** e.g. "/client/support" or "/technician/support" */
  basePath: string;
  onClose: () => void;
}

export default function SupportMenuPanel({
  basePath,
  onClose,
}: SupportMenuPanelProps) {
  const router = useRouter();

  const goTo = (tab: "tickets" | "help") => {
    onClose();
    router.push(`${basePath}?tab=${tab}`);
  };

  return (
    <div
      dir="rtl"
      className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(15rem,calc(100vw-1rem))] rounded-[24px] border border-[#EAECE8] bg-white p-3 shadow-[0_18px_42px_rgba(17,45,39,0.18)]"
    >
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => goTo("tickets")}
          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right text-base text-[#31554B] transition-all hover:bg-[#F8FAF9]"
        >
          <span>التذاكر</span>
          <Ticket size={18} className="text-[#31554B]" />
        </button>


        <button
          type="button"
          onClick={() => goTo("help")}
          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right text-base text-[#31554B] transition-all hover:bg-[#F8FAF9]"
        >
          <span>مركز المساعدة</span>
          <HelpCircle size={18} className="text-[#31554B]" />
        </button>
      </div>
    </div>
  );
}