"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, XCircle } from "lucide-react";

interface RequestOptionsMenuProps {
  /** الحالة الحالية للطلب — بتحدد لو الإلغاء مسموح ولا لأ */
  status: string;
  onCancelClick: () => void;
}

// نفس شرط الباك اند بالظبط: ممنوع الإلغاء في الحالات دي
const NON_CANCELLABLE_STATUSES = [
  "on_the_way",
  "started",
  "completed",
  "cancelled",
];

export default function RequestOptionsMenu({
  status,
  onCancelClick,
}: RequestOptionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCancellable = !NON_CANCELLABLE_STATUSES.includes(status);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleCancelOptionClick = () => {
    setOpen(false);
    if (!isCancellable) {
      setBlockedMessage(
        status === "completed"
          ? "هذا الطلب مكتمل ولا يمكن إلغاؤه."
          : "لا يمكن إلغاء الطلب بعد بدء الفني في التنفيذ أو التوجه للموقع.",
      );
      return;
    }
    onCancelClick();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-1 text-[#A7B2AF] transition hover:bg-[#F6F8F7] hover:text-[#526661]"
        aria-label="خيارات الطلب"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          dir="rtl"
          className="absolute left-0 top-9 z-20 w-[min(13rem,calc(100vw-1rem))] rounded-2xl border border-[#EAEAEA] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          <button
            type="button"
            onClick={handleCancelOptionClick}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-right text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <XCircle size={16} />
            إلغاء الطلب
          </button>
        </div>
      )}

      {/* رسالة توضيحية لما الإلغاء يكون ممنوع في الحالة الحالية */}
      {blockedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setBlockedMessage(null)}
        >
          <div
            dir="rtl"
            className="bg-white w-full max-w-sm mx-4 rounded-3xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-[var(--primary-color)] mb-2">
              تعذر الإلغاء
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {blockedMessage}
            </p>
            <button
              onClick={() => setBlockedMessage(null)}
              className="w-full py-3 rounded-full bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm hover:opacity-90 transition-all"
            >
              حسنًا
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
