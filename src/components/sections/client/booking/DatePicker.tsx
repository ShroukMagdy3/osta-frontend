"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DAYS_AR = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export default function DatePicker({ selectedDate, onDateChange }: Props) {
  const [viewDate, setViewDate] = useState(new Date());

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const getDaysInMonth = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const handleDayClick = (day: number) => {
    const y = viewDate.getFullYear();
    const m = String(viewDate.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onDateChange(`${y}-${m}-${d}`);
  };

  return (
    <div dir="rtl" className="mb-6 p-4 border border-gray-100 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        <span className="font-semibold text-[var(--primary-color)] text-sm">
          {MONTHS_AR[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
          <ChevronLeft size={18} className="text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS_AR.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {getDaysInMonth().map((day, i) => {
          if (!day) return <div key={i} />;
          const y = viewDate.getFullYear();
          const m = String(viewDate.getMonth() + 1).padStart(2, "0");
          const dateStr = `${y}-${m}-${String(day).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;
          const isPast = new Date(dateStr) < new Date(todayStr);

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => handleDayClick(day)}
              className={`w-8 h-8 mx-auto rounded-full text-[11px] font-medium transition-all
                ${isSelected
                  ? "bg-[var(--primary-color)] text-white"
                  : isToday
                    ? "bg-[var(--secondary-color)] text-[var(--primary-color)] font-bold"
                    : isPast
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}