"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  depositAmount: number;
  onClose: () => void;
}

export default function PaymentSuccessModal({ depositAmount, onClose }: Props) {
  const router = useRouter();

  const handleContinue = () => {
    onClose();
    const requestId = sessionStorage.getItem("pendingDepositRequestId");
    router.push(requestId ? `/client/tracking/${requestId}` : "/client/orders");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 mx-4 text-center relative" dir="rtl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-[var(--primary-color)] mb-2">
          تم دفع العربون!
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          دفعت عربون {depositAmount} جنيه لضمان الخدمة
        </p>

        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[var(--accent-color)]/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
              <Check size={32} className="text-[var(--primary-color)]" strokeWidth={3} />
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-full bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <span>↗</span>
          تابع خدمتك
        </button>
      </div>
    </div>
  );
}
