"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, X } from "lucide-react";
import { COLORS } from "@/constants/tracking";
import { trackingApi } from "@/api/services/tracking.service";
import type { TechnicianRequest } from "@/types/tracking.types";
import moneyIcon from "@/assets/icons/money.svg";
import Image from "next/image";

interface Props {
  request: TechnicianRequest;
  requestId: string;
  onClose: () => void;
  onSubmitted: (updated: TechnicianRequest) => void;
}

export default function InvoiceModal({
  request,
  requestId,
  onClose,
  onSubmitted,
}: Props) {
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [hasSupplies, setHasSupplies] = useState(false);
  const [extraMaterialsPrice, setExtraMaterialsPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const servicePrice = Number(price) || 0;
  const materialsPrice = hasSupplies ? Number(extraMaterialsPrice) || 0 : 0;
  const total = servicePrice + materialsPrice;

  const priceMin = request.serviceId?.priceRange?.min;
  const priceMax = request.serviceId?.priceRange?.max;

  const handleSubmit = async () => {
    const parsedServicePrice = Number(price);

    if (!price.trim() || Number.isNaN(parsedServicePrice) || parsedServicePrice <= 0) {
      setError("سعر الخدمة مطلوب");
      return;
    }

    if (priceMin !== undefined && parsedServicePrice < priceMin) {
      setError(`سعر الخدمة لازم يكون ${priceMin} جنيه على الأقل`);
      return;
    }

    if (priceMax !== undefined && parsedServicePrice > priceMax) {
      setError(`سعر الخدمة لازم يكون ${priceMax} جنيه كحد أقصى`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const body: {
        servicePrice: number;
        completionNote?: string;
        extraMaterialsPrice?: number;
      } = { servicePrice: parsedServicePrice };

      if (notes.trim()) body.completionNote = notes.trim();
      if (hasSupplies && extraMaterialsPrice.trim()) {
        body.extraMaterialsPrice = Number(extraMaterialsPrice) || 0;
      }

      const updated = await trackingApi.complete(requestId, body);
      onSubmitted(updated);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
    } finally {
      setSubmitting(false);
    }
  };

  const goToOrders = () => {
    router.push("/technician/orders");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:px-4">
      <div
        dir="rtl"
        className="flex w-full sm:max-w-3xl flex-col overflow-hidden bg-gray-50 shadow-2xl h-full sm:h-[90vh] sm:rounded-[32px]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-4 sm:px-8 py-6">
          <button
            onClick={onClose}
            className="absolute left-4 sm:left-8 top-6 text-gray-400 transition hover:text-gray-600"
          >
            <X size={22} />
          </button>

          <div>
            <h2
              className="flex items-center gap-2 text-xl font-extrabold"
              style={{ color: COLORS.primary }}
            >
              فاتورة الخدمة
              <FileText size={18} />
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {request.userId?.fullName}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col gap-5">

              {/* عنوان الخدمة */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-500">
                  عنوان الخدمة
                </label>
                <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
                  <span className="text-sm font-medium" style={{ color: COLORS.primary }}>
                    {request.serviceId?.name}
                  </span>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.accent }} />
                </div>
              </div>

              {/* السعر */}
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-gray-500">
                  <span className="font-bold">السعر النهائي للخدمة </span>
                  (جنيه)
                </label>
                <div className="flex w-64 items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2">
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                  <button type="button" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                    <Image src={moneyIcon} alt="money" width={16} height={16} />
                  </button>
                </div>
              </div>

              {/* المستلزمات */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm text-gray-500">
                    <span className="font-bold">مستلزمات إضافية </span>
                    (اختياري)
                  </label>
                  <button
                    type="button"
                    onClick={() => setHasSupplies((v) => !v)}
                    className="flex h-6 w-10 rounded-full p-0.5 transition-colors"
                    style={{
                      backgroundColor: hasSupplies ? COLORS.accent : "#E5E7EB",
                      justifyContent: hasSupplies ? "flex-end" : "flex-start",
                    }}
                  >
                    <span className="h-5 w-5 rounded-full bg-white shadow" />
                  </button>
                </div>
                {hasSupplies && (
                  <input
                    type="number"
                    min="0"
                    value={extraMaterialsPrice}
                    onChange={(e) => setExtraMaterialsPrice(e.target.value)}
                    placeholder="سعر المستلزمات"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                  />
                )}
              </div>

              {/* الملاحظات */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-500">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="أي تفاصيل إضافية..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* الإجمالي */}
              <div className="rounded-xl border border-gray-100 bg-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">الإجمالي</span>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold" style={{ color: COLORS.primary }}>
                      {total}
                    </span>
                    <span className="text-sm text-gray-500">جنيه</span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 sm:p-6">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-2xl py-4 text-sm font-bold transition disabled:opacity-50"
            style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
          >
            {submitting ? "بيتبعث..." : "إرسال الفاتورة"}
          </button>
        </div>
      </div>
    </div>
  );
}