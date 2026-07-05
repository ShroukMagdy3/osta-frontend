"use client";

import { Star, ArrowUpLeft, ArrowLeft, Phone, Ban } from "lucide-react";
import Image from "next/image";
import electricIcon from "@/assets/icons/electricicon.svg";
import pin from "@/assets/icons/pin.svg";
import time from "@/assets/icons/time.svg";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ServiceCard {
  _id: string;
  name: string;
  image: string;
  rating: number;
  category: string;
  priceRange?: { min: number; max: number };
  fixingSteps?: { includes: string[] };
}

export interface EmergencyContact {
  phone: string;
  name: string;
}

export interface EmergencyData {
  type: string;
  severity: string;
  contacts: {
    gas?: EmergencyContact;
    fire?: EmergencyContact;
    ambulance?: EmergencyContact;
  };
  tips?: string[]; // dynamic from backend, falls back to generic if empty
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const QUICK_CHIPS = [
  "عطل في غسالة أو ثلاجة",
  "مشكلة في الكهرباء",
  "يوجد تسريب مياه",
  "باب أو نافذة معطلة",
  "جهاز التكييف لا يرد",
];

export const FOLLOW_UP_CHIPS = [
  "ساعدني أكثر حتى يصل الفني 🛠️",
  "أنا بخير، شكراً! ✅",
];

export const SIDEBAR_TIPS = [
  {
    icon: <Image src={electricIcon} alt="Electric" width={20} height={20} />,
    text: "اشرح المشكلة بالتفصيل لتتمكن من مساعدتك",
  },
  {
    icon: <Image src={pin} alt="Pin" width={20} height={20} />,
    text: "حدد مكان المشكلة في المنزل (مطبخ، حمام، صالة)",
  },
  {
    icon: <Image src={time} alt="Time" width={20} height={20} />,
    text: "أخبرنا متى بدأت المشكلة وهل تتكرر",
  },
];

export const COMMON_ISSUES = [
  "جهاز التكييف لا يرد",
  "يوجد تسريب مياه",
  "مشكلة في الكهرباء",
  "باب أو نافذة معطلة",
  "عطل في غسالة أو ثلاجة",
];

const NO_SERVICE_BULLETS = [
  "الوصول الى الفني المختص",
  "سهولة التواصل ومناقشة التفاصيل",
  "الدقة والأمان في العمل",
];

const EMERGENCY_TIPS_FALLBACK = [
  "لا تضغط على أي مفتاح كهرباء أو تشغل ولاعة",
  "افتح كل الشبابيك والأبواب فوراً",
  "أغلق صمام الغاز الرئيسي إن كان في متناولك",
  "اخرج من المكان وابتعد عن المبنى",
];

// ─── Sparkle SVG ─────────────────────────────────────────────────────────────

export function SparkleSvg({
  size = 22,
  color = "white",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill={color}
      />
      <path
        d="M19 14L19.75 17.25L23 18L19.75 18.75L19 22L18.25 18.75L15 18L18.25 17.25L19 14Z"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M5 3L5.5 5.5L8 6L5.5 6.5L5 9L4.5 6.5L2 6L4.5 5.5L5 3Z"
        fill={color}
        opacity="0.6"
      />
    </svg>
  );
}

// ─── AI row label ─────────────────────────────────────────────────────────────

export function AiLabel() {
  return (
    <div className="flex items-center justify-end gap-2 mb-2">
      <span className="text-[11px] font-bold text-[var(--primary-color)]">
        AI أسطى
      </span>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] flex items-center justify-center shrink-0">
        <SparkleSvg size={13} color="#B3E718" />
      </div>
    </div>
  );
}

// ─── Tip Pill ─────────────────────────────────────────────────────────────────

export function TipPill({ tip }: { tip: string }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 text-xs text-amber-800 leading-6 text-right max-w-[88%]">
      {tip}
    </div>
  );
}

// ─── Follow-up chips ──────────────────────────────────────────────────────────

export function FollowUpChipsBubble({
  onSelect,
}: {
  onSelect: (text: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 items-end">
      <p className="text-xs text-gray-500 text-right">
        هل تريد مساعدة إضافية حتى يصل الفني؟
      </p>
      <div className="flex flex-wrap gap-2 justify-end">
        {FOLLOW_UP_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => onSelect(chip)}
            className="bg-[var(--primary-color)]/8 border border-[var(--primary-color)]/20 rounded-full px-4 py-2 text-xs text-[var(--primary-color)] font-semibold hover:bg-[var(--primary-color)] hover:text-white transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Out of scope bubble ──────────────────────────────────────────────────────

export function OutOfScopeBubble() {
  return (
    <div
      className="w-full max-w-[300px] rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 shadow-sm"
      dir="rtl"
    >
      <div className="flex items-center gap-2 mb-2">
        <Ban size={14} className="text-gray-400 shrink-0" />
        <p className="text-xs font-bold text-gray-500">خارج نطاق الخدمة</p>
      </div>
      <p className="text-sm text-gray-600 leading-6">
        أنا متخصص فقط في مشاكل المنازل مثل السباكة والكهرباء والتكييف والنجارة
        وإصلاح الأجهزة. لا أستطيع المساعدة في هذا الموضوع.
      </p>
      <p className="text-xs text-gray-400 mt-2">
        جرب تصف مشكلة في منزلك وسأساعدك 🏠
      </p>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

export function ServiceCardBubble({
  card,
  onRequest,
}: {
  card: ServiceCard;
  onRequest: (id: string) => void;
}) {
  const bullets = card.fixingSteps?.includes ?? [];

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden w-full max-w-[300px] shadow-sm bg-white">
      <div className="relative w-full h-[150px]">
        <img
          src={
            card.image ||
            `https://placehold.co/400x200/1C4B41/B3E718?text=${encodeURIComponent(card.name)}`
          }
          alt={card.name}
          className="w-full h-full object-cover"
        />
        {card.priceRange && (
          <span className="absolute bottom-2 right-2 bg-[var(--accent-color)] text-[var(--primary-color)] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {card.priceRange.min} – {card.priceRange.max} جنيه
          </span>
        )}
        <span className="absolute top-2 left-2 bg-white/85 backdrop-blur-sm text-[var(--primary-color)] text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {card.category}
        </span>
      </div>

      <div className="p-4" dir="rtl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 shrink-0">
            <Star size={13} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold">{card.rating ?? 4.5}</span>
          </div>
          <p className="font-bold text-[var(--primary-color)] text-sm text-right leading-snug">
            {card.name}
          </p>
        </div>

        {bullets.length > 0 && (
          <ul className="space-y-1.5 mb-4" dir="ltr">
            {bullets.slice(0, 4).map((b, i) => (
              <li
                key={i}
                className="flex items-center justify-end gap-2 text-xs text-gray-600"
              >
                {b}
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] shrink-0" />
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => onRequest(card._id)}
          className="w-full bg-[var(--accent-color)] text-[var(--primary-color)] font-bold rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-[var(--accent-hover)] transition-colors"
        >
          <ArrowUpLeft size={15} />
          اطلب الخدمة الآن
        </button>
      </div>
    </div>
  );
}

// ─── Emergency bubble ─────────────────────────────────────────────────────────

export function EmergencyBubble({ data }: { data: EmergencyData }) {
  const contacts = Object.entries(data.contacts).filter(([, v]) => v) as [
    string,
    EmergencyContact,
  ][];

  const tips =
    data.tips && data.tips.length > 0 ? data.tips : EMERGENCY_TIPS_FALLBACK;

  const contactIcon = (key: string) => {
    if (key === "ambulance")
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-red-400">
          <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="2" />
          <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    return <Phone size={14} className="text-red-400" />;
  };

  return (
    <div className="w-full max-w-[320px] rounded-2xl bg-white border border-red-100 overflow-hidden" dir="rtl">
      <div className="px-5 pt-4 pb-3">
        <p className="text-red-500 font-bold text-sm mb-3">
          🚨 حالة طارئة — تصرف فوراً!
        </p>

        <p className="text-red-500 font-bold text-xs mb-2">
          نصائح سريعة بناءً على مشكلتك:
        </p>
        <ul className="space-y-2 mb-4">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-100 mb-3" />

        <p className="text-gray-700 font-bold text-xs mb-2.5">اتصل بالطوارئ الآن:</p>
        <div className="space-y-2">
          {contacts.map(([key, c]) => (
            <a
              key={c.phone}
              href={`tel:${c.phone}`}
              className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                {contactIcon(key)}
                <span className="text-red-500 font-bold text-sm">{c.phone}</span>
              </div>
              <span className="text-xs text-gray-600">{c.name} —</span>
            </a>
          ))}
        </div>

        <button className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors">
          <ArrowLeft size={12} />
          الذهاب الى ارقام الطوارئ
        </button>
      </div>
    </div>
  );
}

// ─── No-service bubble ────────────────────────────────────────────────────────

export function NoServiceBubble({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div
      className="w-full max-w-[300px] rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
      dir="rtl"
    >
      <p className="text-sm text-gray-700 leading-7 mb-3 text-right">
        لم نجد خدمة مطابقة تماماً في المنصة، لكن يمكنك تقديم طلب مخصص وسيتواصل
        معك فني متخصص.
      </p>

      <p className="font-bold text-[var(--primary-color)] text-xs mb-2">
        تشمل الخدمات المتخصصة:
      </p>
      <ul className="space-y-2 mb-4" dir="ltr">
        {NO_SERVICE_BULLETS.map((b, i) => (
          <li
            key={i}
            className="flex items-center justify-end gap-2 text-xs text-gray-600"
          >
            {b}
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] shrink-0" />
          </li>
        ))}
      </ul>

      <button
        onClick={onBrowse}
        className="w-full bg-[var(--primary-color)] text-white font-bold rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <ArrowUpLeft size={15} />
        تصفح الخدمات المتخصصة
      </button>
    </div>
  );
}
