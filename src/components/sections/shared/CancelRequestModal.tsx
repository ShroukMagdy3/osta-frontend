"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { api } from "@/api/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "client" | "technician";

interface CancelReasonOption {
  value: string;
  label: string;
}

interface CancelRequestModalProps {
  requestId: string;
  role: Role;
  serviceName?: string;
  onClose: () => void;
  /** بيتنفذ بعد نجاح الإلغاء — مستخدمة لتحديث الليستة في الصفحة الأم */
  onCancelled: () => void;
}

// ─── أسباب الإلغاء — مختلفة حسب الدور ──────────────────────────────────────────

const CLIENT_REASONS: CancelReasonOption[] = [
  { value: "no_longer_needed", label: "لم أعد بحاجة للخدمة" },
  { value: "found_another", label: "وجدت فنيًا آخر" },
  { value: "price_or_timing", label: "السعر أو الموعد غير مناسب" },
  { value: "other", label: "سبب آخر" },
];

const TECHNICIAN_REASONS: CancelReasonOption[] = [
  { value: "client_unreachable", label: "العميل مبيردّ ولا بيرد / مفيش تواصل" },
  { value: "client_changed_mind", label: "العميل عدل رأيه وعايز يلغي" },
  { value: "cannot_make_time", label: "مش قادر أستلم المواعيد المتفق عليها" },
  { value: "other", label: "سبب آخر" },
];

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function CancelRequestModal({
  requestId,
  role,
  serviceName,
  onClose,
  onCancelled,
}: CancelRequestModalProps) {
  const reasons = role === "client" ? CLIENT_REASONS : TECHNICIAN_REASONS;

  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherText, setOtherText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOtherSelected = selectedReason === "other";
  const canSubmit = selectedReason && (!isOtherSelected || otherText.trim());

  const handleConfirm = async () => {
    if (!canSubmit || loading) return;

    setLoading(true);
    setError("");

    const reasonLabel =
      reasons.find((r) => r.value === selectedReason)?.label ?? "";
    const finalReason = isOtherSelected ? otherText.trim() : reasonLabel;

    try {
      await api.patch(`/requests/${requestId}/cancel`, {
        reason: finalReason,
      });
      onCancelled();
      onClose();
    } catch (err: any) {
      // الباك اند بيرفض الإلغاء لو الحالة on_the_way / started / completed
      const message = err?.response?.data?.message;
      if (
        typeof message === "string" &&
        message.includes("Cannot cancel request at this stage")
      ) {
        setError("لا يمكن إلغاء هذا الطلب الآن — الفني بدأ التنفيذ بالفعل.");
      } else if (typeof message === "string") {
        setError(message);
      } else {
        setError("حدث خطأ أثناء إلغاء الطلب. حاول مرة أخرى.");
      }
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-right">
            <p className="text-xs text-gray-400">
              {serviceName ?? "هذا الطلب"}
            </p>
            <h2 className="text-xl font-bold text-[var(--primary-color)]">
              إلغاء الطلب
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Warning note */}
        <div className="flex items-start gap-2 bg-red-50 rounded-2xl px-4 py-3 mb-5">
          <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-600 leading-relaxed">
            إلغاء الطلب نهائي ولا يمكن التراجع عنه. سيتم إشعار{" "}
            {role === "client" ? "الفني" : "العميل"} بالإلغاء فورًا.
          </p>
        </div>

        {/* Reason list */}
        <p className="text-sm font-bold text-[var(--primary-color)] mb-3 text-right">
          ما سبب الإلغاء؟
        </p>

        <div className="flex flex-col gap-2 mb-4">
          {reasons.map((reason) => {
            const isSelected = selectedReason === reason.value;
            return (
              <button
                key={reason.value}
                type="button"
                onClick={() => setSelectedReason(reason.value)}
                className={`w-full text-right px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                  isSelected
                    ? "border-[var(--primary-color)] bg-[var(--secondary-color)] text-[var(--primary-color)]"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {reason.label}
              </button>
            );
          })}
        </div>

        {/* Optional free text — يظهر فقط لو اختار "سبب آخر" */}
        {isOtherSelected && (
          <textarea
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="اكتب السبب هنا..."
            dir="rtl"
            rows={3}
            className="w-full mb-4 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[var(--primary-color)] transition-colors resize-none"
          />
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs text-center mb-3 leading-relaxed">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3.5 rounded-full border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            تراجع
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canSubmit || loading}
            className={`flex-1 py-3.5 rounded-full font-bold text-sm transition-all ${
              !canSubmit || loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {loading ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
          </button>
        </div>
      </div>
    </div>
  );
}
