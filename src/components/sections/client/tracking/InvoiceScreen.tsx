"use client";

import { ClientRequest } from "@/types/trackingClient.types";
import { Check, FileText, CreditCard } from "lucide-react";

const COLORS = {
  primary: "#1C4B41",
  accent: "#B3E718",
  secondary: "#F1F7E7",
  warning: "#C2783C",
};

function getInvoiceAmounts(request: ClientRequest) {
  const servicePrice = request.servicePrice ?? 0;
  const materialsPrice = request.extraMaterialsPrice ?? 0;
  const total = request.totalPrice ?? servicePrice + materialsPrice;
  const prepaid = request.depositStatus === "paid" ? (request.depositAmount ?? 0) : 0;
  const remaining = request.isFullyPaid ? 0 : Math.max(total - prepaid, 0);
  const completionNote =
    request.completionNote &&
    request.completionNote.trim() !== "" &&
    request.completionNote !== "لا يوجد"
      ? request.completionNote
      : null;
  return { servicePrice, materialsPrice, total, prepaid, remaining, completionNote };
}

interface Props {
  request: ClientRequest;
  onPay: () => void;
  paying: boolean;
  error: string;
}

export default function InvoiceScreen({ request, onPay, paying, error }: Props) {
  const { servicePrice, materialsPrice, total, prepaid, remaining, completionNote } =
    getInvoiceAmounts(request);

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(28, 75, 65, 0.68)" }}
    >
      <div className="relative w-full max-w-md rounded-[28px] bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold" style={{ color: COLORS.primary }}>فاتورة الخدمة</h2>
            <FileText className="w-4 h-4" style={{ color: COLORS.primary }} />
          </div>
          <span className="text-sm text-gray-400">
            من الفني {request.assignedTechnician?.fullName ?? "-"}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: COLORS.secondary, color: COLORS.primary }}>
            {request.serviceId?.name}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>أجرة الفني</span>
            <span>{servicePrice} جنيه</span>
          </div>

          {materialsPrice > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>مواد ومستلزمات</span>
              <span>{materialsPrice} جنيه</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm font-bold" style={{ color: COLORS.primary }}>
            <span>الإجمالي</span>
            <span>{total} جنيه</span>
          </div>

          {completionNote && (
            <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: COLORS.secondary }}>
              <p className="text-xs font-semibold mb-1" style={{ color: COLORS.primary }}>ملاحظة الفني</p>
              <p className="text-xs text-gray-600 leading-6">&quot;{completionNote}&quot;</p>
            </div>
          )}

          {prepaid > 0 && (
            <div className="flex items-center justify-between text-sm font-semibold" style={{ color: COLORS.warning }}>
              <span>{prepaid} جنيه (عربون مدفوع)</span>
              <span>-</span>
            </div>
          )}

          {remaining > 0 ? (
            <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ backgroundColor: COLORS.primary }}>
              <span className="text-sm font-bold text-white">المطلوب دفعه الآن</span>
              <span className="text-xl font-extrabold" style={{ color: COLORS.accent }}>{remaining} جنيه</span>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ backgroundColor: COLORS.secondary }}>
              <span className="text-sm font-bold" style={{ color: COLORS.primary }}>تم سداد الفاتورة بالكامل</span>
              <Check className="w-4 h-4" style={{ color: COLORS.primary }} />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            onClick={onPay}
            disabled={paying}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold disabled:opacity-50"
            style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
          >
            {remaining > 0 ? (
              <>
                <CreditCard className="w-4 h-4" />
                {paying ? "بيتم الدفع..." : `ادفع ${remaining} جنيه`}
              </>
            ) : (
              "متابعة لتقييم الخدمة"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}