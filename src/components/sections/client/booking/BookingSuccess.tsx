"use client";

import Button from "@/components/ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  onClose: () => void;
}

export default function BookingSuccess({ onClose }: Props) {
  const router = useRouter();

  return (
    <div
      className="relative flex flex-col items-center text-center py-6 px-6"
      dir="rtl"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 left-3 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
        aria-label="إغلاق"
      >
        <X size={18} className="text-gray-500" />
      </button>

      <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-2">
        تم إرسال طلبك!
      </h2>

      <p className="text-gray-400 text-sm mb-8">
        سيتواصل معك فريقنا في أقرب وقت لإرسال الحرفي المناسب.
      </p>

      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-[var(--accent-color)]/20 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[var(--accent-color)]/40 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          onClose();
          router.push("/client/orders");
        }}
      >
        تتبع الطلب
      </Button>
    </div>
  );
}
