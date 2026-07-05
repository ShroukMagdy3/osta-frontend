"use client";

import { X, Check } from "lucide-react";

interface SuccessPopupProps {
  ticketNumber: string;
  onClose: () => void;
}

export default function SuccessPopup({
  ticketNumber,
  onClose,
}: SuccessPopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm mx-4 rounded-3xl p-8 text-center relative"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-6 left-6 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <X size={16} className="text-gray-400" />
        </button>

        <h2 className="text-xl font-bold text-[var(--primary-color)] mt-6 mb-3">
          تم إرسال التذكرة بنجاح
        </h2>

        <p className="text-sm text-gray-400 mb-8">
          تم استلام تذكرتك #{ticketNumber}، وسيتم الرد عليها في أقرب وقت.
        </p>

        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[var(--accent-color)]/15 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
              <Check size={28} className="text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-full font-bold text-base bg-[var(--accent-color)] text-[var(--primary-color)] hover:bg-[var(--accent-hover)] transition-all"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}
