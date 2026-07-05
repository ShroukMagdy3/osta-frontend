"use client";

import { Ban, Calendar, Clock, MapPin, Phone } from "lucide-react";

// ─── Sparkle/Wrench SVG (matches client's SparkleSvg style) ─────────────────

export function WrenchSvg({
  size = 22,
  color = "white",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── AI Label (mirrors client's AiLabel) ─────────────────────────────────────

export function TechAiLabel() {
  return (
    <div className="flex items-center justify-end gap-2 mb-2">
      <span className="text-[11px] font-bold text-[var(--primary-color)]">
        TechCompanion AI
      </span>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] flex items-center justify-center shrink-0">
        <WrenchSvg size={13} color="#B3E718" />
      </div>
    </div>
  );
}

// ─── Out of scope bubble ──────────────────────────────────────────────────────

export function TechOutOfScopeBubble() {
  return (
    <div
      className="w-full max-w-[300px] rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 shadow-sm"
      dir="rtl"
    >
      <div className="flex items-center gap-2 mb-2">
        <Ban size={14} className="text-gray-400 shrink-0" />
        <p className="text-xs font-bold text-gray-500">خارج نطاق تخصصي</p>
      </div>
      <p className="text-sm text-gray-600 leading-6">
        أنا متخصص فقط في الأسئلة التقنية المتعلقة بمجال عملك وإدارة جدولك
        اليومي. لا أستطيع المساعدة في هذا الموضوع.
      </p>
      <p className="text-xs text-gray-400 mt-2">
        جرب اسألني عن عطل تقني أو جدول مواعيدك 🔧
      </p>
    </div>
  );
}

// ─── Schedule card bubble ─────────────────────────────────────────────────────

export interface ScheduleEntry {
  clientName: string;
  phone: string;
  service: string;
  time: string;
  district: string;
  outOfCity?: boolean;
}

export function ScheduleCardBubble({
  entries,
  label,
}: {
  entries: ScheduleEntry[];
  label: string;
}) {
  if (!entries.length) return null;
  return (
    <div
      className="w-full max-w-[320px] rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
      dir="rtl"
    >
      <div className="bg-[var(--primary-color)] px-4 py-2.5 flex items-center gap-2">
        <Calendar size={14} className="text-[var(--accent-color)]" />
        <span className="text-white font-bold text-xs">
          {label} — {entries.length} طلب
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {entries.map((e, i) => (
          <div key={i} className="px-4 py-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock size={10} /> {e.time}
              </span>
              <span className="text-sm font-bold text-[var(--primary-color)]">
                {e.clientName}
              </span>
            </div>
            <p className="text-xs text-gray-600 text-right">{e.service}</p>
            <div className="flex items-center justify-between">
              <a
                href={`tel:${e.phone}`}
                className="text-[10px] text-[var(--primary-color)] flex items-center gap-1 hover:underline"
              >
                <Phone size={10} /> {e.phone}
              </a>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <MapPin size={10} /> {e.district}
                {e.outOfCity && (
                  <span className="text-orange-500 font-bold">
                    {" "}
                    [خارج المدينة]
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tip pill (matches client's TipPill style) ────────────────────────────────

export function TechTipPill({ tip }: { tip: string }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 text-xs text-amber-800 leading-6 text-right max-w-[88%]">
      {tip}
    </div>
  );
}
