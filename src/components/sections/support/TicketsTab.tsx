"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, History, Lightbulb, Paperclip } from "lucide-react";
import { supportService, SupportTicket } from "@/api/services/support.service";
import StatusBadge from "./StatusBadge";

const TIPS = [
  "اكتب وصفاً واضحاً للمشكلة مع رقم الحجز إن وجد",
  "أرفق لقطات شاشة أو فواتير لتسريع المعالجة",
  "تأكد من بيانات التواصل لتتلقى الرد دون تأخير",
];

function formatTicketDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const day = isToday
    ? "اليوم"
    : date.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
  return `${day} - ${time}`;
}

interface TicketsTabProps {
  refreshKey: number;
  onRaiseTicket: () => void;
  onShowTicket: (id: string) => void;
}

export default function TicketsTab({
  refreshKey,
  onRaiseTicket,
  onShowTicket,
}: TicketsTabProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    supportService
      .getMyTickets(1, 20)
      .then(({ data }) => {
        if (!active) return;
        setTickets(data?.data ?? []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.response?.data?.message || "تعذر تحميل التذاكر");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [refreshKey]);

  return (
    <div className="flex flex-col gap-6">
      {/* تذاكري */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-full bg-[var(--primary-color)] flex items-center justify-center flex-shrink-0">
            <History size={16} className="text-white" />
          </div>

          <div className="text-right flex-1 mr-3">
            <h3 className="font-bold text-[var(--primary-color)]">تذاكري</h3>
            <p className="text-xs text-gray-400 mt-1">
              جميع طلبات الدعم التي قمت بإنشائها وحالتها الحالية
            </p>
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <p className="text-center text-sm text-gray-400 py-10">
              جاري التحميل...
            </p>
          )}

          {error && (
            <p className="text-center text-sm text-red-500 py-4">{error}</p>
          )}

          {!loading && !error && tickets.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-10">
              لا توجد تذاكر بعد. ابدأ برفع تذكرة جديدة لو احتجت مساعدة.
            </p>
          )}

          {!loading && tickets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      #{ticket.ticketNumber}
                    </span>
                    <StatusBadge status={ticket.status} />
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-sm text-[var(--primary-color)]">
                      {ticket.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTicketDate(ticket.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      {ticket.attachmentUrl ? (
                        <>
                          <Paperclip size={12} />1 مرفق
                        </>
                      ) : (
                        ""
                      )}
                    </span>

                    <button
                      onClick={() => onShowTicket(ticket._id)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-[var(--primary-color)] hover:text-[var(--accent-hover)] transition-all"
                    >
                      عرض التفاصيل
                      <ArrowLeft size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* نصائح قبل رفع التذكرة */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-full bg-[var(--primary-color)] flex items-center justify-center flex-shrink-0">
            <Lightbulb size={16} className="text-white" />
          </div>

          <div className="text-right flex-1 mr-3">
            <h3 className="font-bold text-[var(--primary-color)]">
              نصائح قبل رفع التذكرة
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              لمساعدتك أسرع، أرفق أكبر قدر من التفاصيل
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {TIPS.map((tip, index) => (
              <div
                key={tip}
                className="bg-gray-50 rounded-2xl p-4 flex items-start gap-2 text-right"
              >
                <span className="w-5 h-5 rounded-full bg-[var(--accent-color)] text-[var(--primary-color)] text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-500 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onRaiseTicket}
            className="bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm px-6 py-3 rounded-full hover:bg-[var(--accent-hover)] transition-all"
          >
            ارفع تذكرة
          </button>
        </div>
      </div>
    </div>
  );
}
