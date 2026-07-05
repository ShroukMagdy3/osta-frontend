"use client";

import { SIDEBAR_TIPS, COMMON_ISSUES } from "./ChatBubbles";

interface Props {
  onSendMessage: (text: string) => void;
}

export default function ChatSidebar({ onSendMessage }: Props) {
  return (
    <div className="hidden w-full shrink-0 flex-col gap-5 overflow-y-auto p-5 no-scrollbar md:flex md:w-70">
      {/* Brand block */}
      <div>
        <h3 className="text-white font-black text-3xl mb-2">أسطى AI</h3>
        <p className="text-white/60 text-xs leading-5">
          مساعدك الذكي لتشخيص مشكلات المنزل والوصول إلى أفضل الفنيين
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
              <span className="text-base shrink-0">{tip.icon}</span>
              <p className="text-white/80 text-xs leading-5 text-right">
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Common issues */}
      <div>
        <p className="text-[var(--accent-color)] font-bold text-sm mb-3">
          مشاكل شائعة
        </p>
        <div className="space-y-2">
          {COMMON_ISSUES.map((issue) => (
            <button
              key={issue}
              onClick={() => onSendMessage(issue)}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-xs text-right rounded-xl px-3 py-3 transition-colors"
            >
              {issue}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
