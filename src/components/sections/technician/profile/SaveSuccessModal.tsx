"use client";

import { Check } from "lucide-react";

interface SaveSuccessModalProps {
  title?: string;
  message?: string;
  onClose: () => void;
}

export default function SaveSuccessModal({
  title = "تم حفظ التغييرات",
  message = "تم تحديث بياناتك بنجاح",
  onClose,
}: SaveSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        dir="rtl"
        className="relative mx-4 w-full max-w-sm rounded-3xl bg-white p-8 text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
        >
          ✕
        </button>

        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--accent-color)]/20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-color)]">
              <Check
                size={32}
                className="text-[var(--primary-color)]"
                strokeWidth={3}
              />
            </div>
          </div>
        </div>

        <h2 className="mb-2 text-xl font-bold text-[var(--primary-color)]">
          {title}
        </h2>
        <p className="mb-8 text-sm text-gray-500">{message}</p>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-[var(--accent-color)] py-3.5 text-sm font-bold text-[var(--primary-color)] transition-all hover:opacity-90"
        >
          تمام
        </button>
      </div>
    </div>
  );
}
