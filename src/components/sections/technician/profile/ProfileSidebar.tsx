"use client";

import {
  Camera,
  User,
  Briefcase,
  Wrench,
  MapPin,
  ShieldCheck,
  Lock,
  Star,
  Wallet 
} from "lucide-react";

export type ProfileTab =
  | "account"
  | "work"
  | "experience"
  | "area"
  | "identity"
  | "security"
  | "reviews"
  |"wallet";

interface SidebarStats {
  yearsOfExperience: number;
  totalOrders: number;
  averageRating: number;
}

interface ProfileSidebarProps {
  fullName: string;
  category: string;
  isVerified: boolean;
  stats: SidebarStats;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const TABS: { id: ProfileTab; label: string; icon: typeof User }[] = [
  { id: "account", label: "بيانات الحساب", icon: User },
  { id: "work", label: "بيانات العمل", icon: Briefcase },
  { id: "experience", label: "الخبرة والأدوات", icon: Wrench },
  { id: "area", label: "منطقة العمل", icon: MapPin },
  { id: "identity", label: "التحقق من الهوية", icon: ShieldCheck },
  { id: "security", label: "الأمان", icon: Lock },
  { id: "reviews", label: "التقييمات", icon: Star },
  { id: "wallet", label: "المحفظة", icon: Wallet },
];

export default function ProfileSidebar({
  fullName,
  category,
  isVerified,
  stats,
  activeTab,
  onTabChange,
}: ProfileSidebarProps) {
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");

  return (
    <div
      dir="rtl"
      className="overflow-hidden rounded-[28px] border border-[#EAECE8] bg-white shadow-sm"
    >
      {/* Header band with avatar */}
      <div className="primary-gradient relative flex flex-col items-center pb-6 pt-8">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-color)] to-[#7FB81C] text-2xl font-bold text-[var(--primary-color)]">
            {initials}
          </div>
          <button
            type="button"
            title="تغيير الصورة الشخصية — قريباً"
            disabled
            className="absolute -bottom-1 -left-1 flex h-7 w-7 cursor-not-allowed items-center justify-center rounded-full bg-white text-[var(--primary-color)] shadow-md"
          >
            <Camera size={13} />
          </button>
        </div>
      </div>

      {/* Name / category / badge */}
      <div className="flex flex-col items-center px-6 pb-5 pt-4 text-center">
        <h2 className="text-lg font-bold text-[#112D27]">{fullName}</h2>
        {category && <p className="mt-1 text-sm text-gray-400">{category}</p>}

        {isVerified && (
          <span className="mt-3 flex items-center gap-1.5 rounded-full bg-[var(--secondary-color)] px-3 py-1 text-xs font-semibold text-[var(--primary-color)]">
            موثّق
            <ShieldCheck size={13} className="text-[var(--primary-color)]" />
          </span>
        )}

        {/* Stats row */}
        <div className="mt-5 grid w-full grid-cols-3 divide-x divide-x-reverse divide-gray-100 border-t border-gray-100 pt-4">
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-[#112D27]">
              {stats.yearsOfExperience}
            </span>
            <span className="text-xs text-gray-400">السنوات</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-[#112D27]">
              {stats.totalOrders}
            </span>
            <span className="text-xs text-gray-400">الطلبات</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-[#112D27]">
              {stats.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">التقييم</span>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-col gap-1 px-3 pb-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${
                active
                  ? "bg-[var(--accent-color)] font-bold text-[var(--primary-color)]"
                  : "font-medium text-[#112D27] hover:bg-gray-50"
              }`}
            >
              <span>{tab.label}</span>
              <Icon
                size={18}
                className={
                  active ? "text-[var(--primary-color)]" : "text-gray-400"
                }
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
