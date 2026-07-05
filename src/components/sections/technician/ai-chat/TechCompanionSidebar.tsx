"use client";

import { Wrench, CalendarDays, Lightbulb } from "lucide-react";

interface Props {
  chips: string[];
  onSendMessage: (text: string) => void;
}

const SIDEBAR_TIPS = [
  {
    icon: <Wrench size={16} className="text-[var(--accent-color)]" />,
    text: "اذكر اسم الجهاز والموديل لتشخيص أدق",
  },
  {
    icon: <Lightbulb size={16} className="text-[var(--accent-color)]" />,
    text: "صف رمز الخطأ بالضبط للحصول على حل فوري",
  },
  {
    icon: <CalendarDays size={16} className="text-[var(--accent-color)]" />,
    text: "اسألني عن جدولك بأي صياغة تريدها",
  },
];

export default function TechCompanionSidebar({ chips, onSendMessage }: Props) {
  return (
    <div className="hidden w-full shrink-0 flex-col gap-5 overflow-y-auto p-5 no-scrollbar md:flex md:w-70">
      {/* Brand block */}
      <div>
        <h3 className="text-white font-black text-3xl mb-2">
          Tech
          <br />
          Companion
        </h3>
        <p className="text-white/60 text-xs leading-5">
          مساعدك الذكي للتشخيص التقني وإدارة جدولك اليومي
        </p>
      </div>

      {/* Tips */}
      <div>
        <p className="text-[var(--accent-color)] font-bold text-sm mb-3">
          نصائح للحصول على مساعدة أفضل
        </p>
        <div className="space-y-2">
          {SIDEBAR_TIPS.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white/10 rounded-2xl p-3"
            >
              <span className="shrink-0 mt-0.5">{tip.icon}</span>
              <p className="text-white/80 text-xs leading-5 text-right">
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic quick questions */}
      <div>
        <p className="text-[var(--accent-color)] font-bold text-sm mb-3">
          أسئلة شائعة في تخصصك
        </p>
        <div className="space-y-2">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => onSendMessage(chip)}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-xs text-right rounded-xl px-3 py-3 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
