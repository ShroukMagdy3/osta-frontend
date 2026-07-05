"use client";

import { api } from "@/api/axios";
import { X, Star } from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DepositModalProps {
  requestId: string;
  serviceName: string;
  categoryName: string;
  technicianName: string;
  technicianRating?: number;
  priceMin?: number;
  priceMax?: number;
  depositAmount: number;
  onClose: () => void;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function DepositModal({
  requestId,
  serviceName,
  categoryName,
  technicianName,
  technicianRating,
  priceMin,
  priceMax,
  depositAmount,
  onClose,
}: DepositModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProceed = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(`/payment/deposit/${requestId}`);
      // الـ response: { success, message, data: { paymentUrl, paymentId } }
      const paymentUrl = data?.data?.paymentUrl;

      if (!paymentUrl) {
        setError("لم يتم الحصول على رابط الدفع");
        setLoading(false);
        return;
      }

      // نحفظ الـ requestId عشان نستخدمه بعد ما اليوزر يرجع من بوابة الدفع
      sessionStorage.setItem("pendingDepositRequestId", requestId);

      window.location.href = paymentUrl;
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(message || "حدث خطأ في الدفع");
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
        <div className="flex items-center justify-between mb-6">
          <div className="text-right">
            <p className="text-xs text-gray-400">تأكيد الحجز</p>
            <h2 className="text-xl font-bold text-[var(--primary-color)]">
              دفع العربون
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Service + Technician card */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-[var(--primary-color)]">
              {serviceName}
            </span>
            <span className="text-sm text-gray-400">{categoryName}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-[var(--primary-color)]">
              الفني: {technicianName}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500 mr-1">
                {technicianRating}
              </span>

              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={
                    star <= Math.round(technicianRating ?? 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-200 my-3" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">سعر الخدمة</span>

            {priceMin && priceMax ? (
              <span className="text-sm text-gray-500">
                {priceMin} - {priceMax} جنية
              </span>
            ) : (
              <span className="text-sm text-gray-400">—</span>
            )}
          </div>
        </div>

        {/* Deposit amount */}
        <div className="bg-[var(--secondary-color)] rounded-2xl p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="text-right">
              <p className="font-bold text-[var(--primary-color)]">
                مبلغ العربون
              </p>
              <p className="text-xs text-[var(--accent-color)] font-medium">
                مستحق دفعه الآن
              </p>
            </div>
            <div className="text-left">
              <p className="font-bold text-2xl text-[var(--primary-color)]">
                {depositAmount}{" "}
                <span className="text-sm font-normal">جنيه</span>
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs text-center mb-3">{error}</p>
        )}

        {/* Note */}
        <p className="text-xs text-gray-400 text-center mb-5">
          سيتم تحويلك لبوابة الدفع الآمنة لإتمام العملية
        </p>

        {/* CTA */}
        <button
          onClick={handleProceed}
          disabled={loading}
          className={`w-full py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all
            ${loading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[var(--accent-color)] text-[var(--primary-color)] hover:opacity-90"
            }`}
        >
          {loading ? "جاري التحويل..." : "متابعة الدفع"}
        </button>
      </div>
    </div>
  );
}