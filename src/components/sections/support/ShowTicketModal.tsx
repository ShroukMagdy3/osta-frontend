"use client";

import { useEffect, useState } from "react";
import { X, Paperclip } from "lucide-react";
import { supportService, SupportTicket } from "@/api/services/support.service";
import StatusBadge from "./StatusBadge";

interface ShowTicketModalProps {
  ticketId: string;
  onClose: () => void;
}

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

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export default function ShowTicketModal({
  ticketId,
  onClose,
}: ShowTicketModalProps) {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await supportService.getTicketById(ticketId);
        if (!isActive) return;

        const ticketObj = response.data as any;
        if (ticketObj && ticketObj.data) {
          const ticket: SupportTicket = ticketObj.data;
          setTicket(ticket);
        }
      } catch (error: unknown) {
        if (!isActive) return;
        let errorMsg = "تعذر تحميل بيانات التذكرة";
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const apiError = error as {
            response?: { data?: { message?: string } };
          };
          errorMsg = apiError.response?.data?.message || errorMsg;
        }
        setError(errorMsg);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [ticketId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header — title block first so it renders on the right in RTL, X second so it lands on the left */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-[var(--primary-color)]">
              {ticket?.title}
            </h2>
            {ticket && <StatusBadge status={ticket.status} />}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {ticket && (
          <p className="text-xs text-gray-400 text-right mb-6">
            {formatTicketDate(ticket.createdAt)} &nbsp;&nbsp; #
            {ticket.ticketNumber}
          </p>
        )}

        {loading && (
          <p className="text-center text-sm text-gray-400 py-10">
            جاري التحميل...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-xs text-center mb-3">{error}</p>
        )}

        {ticket && !loading && (
          <>
            {/* Description */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                الوصف
              </p>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {ticket.description}
                </p>
              </div>
            </div>

            {/* Attachments */}
            {ticket.attachmentUrl && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                  المرفقات
                </p>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}${ticket.attachmentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 hover:bg-gray-100 transition-all"
                >
                  <span className="text-xs text-gray-400">
                    {formatFileSize(ticket.attachmentSize)}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-[var(--primary-color)]">
                    {ticket.attachmentName}
                    <Paperclip size={14} className="text-gray-400" />
                  </span>
                </a>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-4 rounded-full font-bold text-base bg-[var(--accent-color)] text-[var(--primary-color)] hover:bg-[var(--accent-hover)] transition-all"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}
