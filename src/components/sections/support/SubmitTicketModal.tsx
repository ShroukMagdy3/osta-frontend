"use client";

import { useRef, useState } from "react";
import { X, Camera } from "lucide-react";
import { supportService, SupportTicket } from "@/api/services/support.service";

const DESCRIPTION_MAX = 100;
const TITLE_MAX = 150;

interface SubmitTicketModalProps {
  onClose: () => void;
  onSuccess: (ticketNumber: string) => void;
}

export default function SubmitTicketModal({
  onClose,
  onSuccess,
}: SubmitTicketModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError("من فضلك أدخل العنوان ووصف المشكلة");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await supportService.createTicket({
        title: title.trim(),
        description: description.trim(),
        attachment,
      });
      const ticket: SupportTicket = response.data.data;
      onSuccess(ticket.ticketNumber);
    } catch (err) {
      const errorMessage =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      setError(errorMessage || "حدث خطأ أثناء إرسال التذكرة");
    } finally {
      setLoading(false);
    }
  };

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
        {/* Header — title first so it renders on the right in RTL, X second so it lands on the left */}
        <div className="flex items-start justify-between mb-6">
          <div className="text-right">
            <h2 className="text-xl font-bold text-[var(--primary-color)]">
              رفع تذكرة
            </h2>
            <p className="text-xs text-gray-400 mt-1">اليوم</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs text-center mb-3">{error}</p>
        )}

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[var(--primary-color)] mb-2">
            العنوان<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
            placeholder="تأخر وصول الفني لموعد الصيانة"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[var(--primary-color)] placeholder:text-gray-300 focus:outline-none focus:border-[var(--accent-color)]"
          />
        </div>

        {/* Description */}
        <div className="mb-2">
          <label className="block text-sm font-semibold text-[var(--primary-color)] mb-2">
            وصف المشكلة<span className="text-red-500">*</span>
          </label>
          <div className="rounded-2xl border border-gray-200 focus-within:border-[var(--accent-color)]">
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value.slice(0, DESCRIPTION_MAX))
              }
              placeholder="أرغب في تركيب مرايا كبيرة في الحمام، تحتاج إلى تثبيت محكم في الجدار مع ضمان السلامة والاستواء."
              rows={4}
              className="w-full resize-none px-4 pt-3 text-sm text-[var(--primary-color)] placeholder:text-gray-300 focus:outline-none bg-transparent"
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <span className="text-xs text-gray-300">
                {description.length}/{DESCRIPTION_MAX}
              </span>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--primary-color)] border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-all"
              >
                <Camera size={14} />
                {attachment
                  ? attachment.name.slice(0, 18)
                  : "ارفق صورة لتوضيح مشكلتك"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full mt-4 py-4 rounded-full font-bold text-base transition-all
            ${
              loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[var(--accent-color)] text-[var(--primary-color)] hover:bg-[var(--accent-hover)]"
            }`}
        >
          {loading ? "جاري الإرسال..." : "إرسال"}
        </button>
      </div>
    </div>
  );
}
