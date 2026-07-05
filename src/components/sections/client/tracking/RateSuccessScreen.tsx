"use client";

import { Check, Star, X } from "lucide-react";

const COLORS = { primary: "#1C4B41", accent: "#B3E718", gold: "#FBBF24" };

interface Props {
  rating: number;
  onBackToHome: () => void;
}

export default function RateSuccessScreen({ rating, onBackToHome }: Props) {
  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center px-3 py-4 sm:px-4" style={{ backgroundColor: "rgba(28, 75, 65, 0.68)" }}>
      <div className="relative w-full max-w-[442px] rounded-[32px] bg-white px-5 py-8 text-center shadow-xl sm:px-8 sm:py-10">
        <button type="button" onClick={onBackToHome} className="absolute left-4 top-4 text-gray-900 transition hover:opacity-70 sm:left-8 sm:top-8">
          <X className="h-5 w-5" />
        </button>

        <h2 className="mt-8 flex items-center justify-center gap-2 text-2xl font-extrabold sm:text-3xl" style={{ color: COLORS.primary }}>
          تم نشر تقييمك!
          <Star className="h-6 w-6" style={{ color: COLORS.gold }} fill={COLORS.gold} />
        </h2>

        <p className="mx-auto mt-5 max-w-[310px] text-sm leading-7 text-gray-500">شكراً لثقتك في أسطى</p>

        <div className="mt-5 flex items-center justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star key={value} className="h-5 w-5" style={{ color: value <= rating ? COLORS.gold : "#E5E7EB" }} fill={value <= rating ? COLORS.gold : "transparent"} />
          ))}
        </div>

        <div className="mx-auto mt-8 flex h-[124px] w-[124px] items-center justify-center rounded-full" style={{ backgroundColor: `${COLORS.accent}26` }}>
          <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full" style={{ backgroundColor: COLORS.accent }}>
            <Check className="h-9 w-9" style={{ color: COLORS.primary }} strokeWidth={2.5} />
          </div>
        </div>

        <button type="button" onClick={onBackToHome} className="mt-10 h-[43px] w-full min-w-[0] rounded-full px-6 text-sm font-bold transition hover:brightness-95 sm:min-w-[196px] sm:w-auto" style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}>
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}