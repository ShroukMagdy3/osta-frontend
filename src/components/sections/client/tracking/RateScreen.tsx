"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const COLORS = { primary: "#1C4B41", accent: "#B3E718", gold: "#FBBF24" };

interface Props {
  technicianName: string;
  onSubmit: (rating: number, comment: string) => void;
  submitting: boolean;
  error: string;
}

export default function RateScreen({ technicianName, onSubmit, submitting, error }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(28, 75, 65, 0.68)" }}>
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-xl">
        <div className="px-8 py-7 text-center" style={{ backgroundColor: COLORS.primary }}>
          <p className="text-xs font-medium text-white/70">قيّم تجربتك</p>
          <h2 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">كيف كانت الخدمة؟</h2>
        </div>

        <div className="flex flex-col items-center gap-4 px-8 py-7">
          <span className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold" style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}>
            {technicianName.charAt(0) || "؟"}
          </span>
          <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>{technicianName}</span>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const filled = value <= (hovered || rating);
              return (
                <button key={value} type="button" onClick={() => setRating(value)} onMouseEnter={() => setHovered(value)} onMouseLeave={() => setHovered(0)}>
                  <Star className="w-7 h-7 transition" style={{ color: filled ? COLORS.gold : "#E5E7EB" }} fill={filled ? COLORS.gold : "transparent"} />
                </button>
              );
            })}
          </div>

          <div className="w-full">
            <label className="text-sm text-gray-500 block mb-2">تعليق (اختياري)</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="اكتب تعليقك هنا..." rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button onClick={() => onSubmit(rating, comment)} disabled={submitting || rating === 0} className="w-full py-3 rounded-full font-bold text-sm disabled:opacity-50" style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}>
            {submitting ? "بيتبعث..." : "نشر التقييم"}
          </button>
        </div>
      </div>
    </div>
  );
}