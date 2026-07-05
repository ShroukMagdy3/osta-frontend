"use client";

import { Lock } from "lucide-react";
import PasswordSection from "@/components/sections/client/profile/PasswordSection";

interface SecuritySectionProps {
  email: string;
  passwordChangedAt?: string | null;
  onPasswordChanged: () => void;
}

export default function SecuritySection({
  email,
  passwordChangedAt,
  onPasswordChanged,
}: SecuritySectionProps) {
  return (
    <div dir="rtl" className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-start  gap-3 rounded-[24px] border border-[#EAECE8] bg-white px-6 py-5 shadow-sm">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--secondary-color)]">
          <Lock size={16} className="text-[var(--primary-color)]" />
        </div>
        <div className="text-right">
          <h2 className="text-base font-bold text-[#112D27]">الأمان</h2>
          <p className="mt-1 text-xs text-gray-400">
            حافظ على أمان حسابك بكلمة مرور قوية ومتجددة
          </p>
        </div>
      </div>

      {/* Reuse the exact same PasswordSection used in client profile */}
      <PasswordSection
        email={email}
        passwordChangedAt={passwordChangedAt ?? undefined}
        onPasswordChanged={onPasswordChanged}
      />
    </div>
  );
}
