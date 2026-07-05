"use client";

import { Phone, Mail, User, Info } from "lucide-react";
import Button from "@/components/ui/Button";

interface AccountInfoSectionProps {
  phone: string;
  email: string;
}

export default function AccountInfoSection({
  phone,
  email,
}: AccountInfoSectionProps) {
  return (
    <div
      dir="rtl"
      className="rounded-[24px] border border-[#EAECE8] bg-white p-6 shadow-sm"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-start gap-2" dir="rtl">
  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--secondary-color)]">
    <User size={16} className="text-[var(--primary-color)]" />
  </div>

  <h2 className="text-base font-bold text-[#112D27]">
    بيانات الحساب
  </h2>
</div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2" dir='ltr'>
        <div>
          <label className="mb-2 block text-sm text-gray-400" dir="rtl">رقم الهاتف</label>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3" >
            <Phone size={16} className="flex-shrink-0 text-gray-400" />
            <span
              className="flex-1 text-left text-sm font-medium text-[#112D27]"
            >
              {phone || "—"}
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400" dir="rtl">
            البريد الإلكتروني
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Mail size={16} className="flex-shrink-0 text-gray-400" />
            <span
              dir="ltr"
              className="flex-1 truncate text-left text-sm font-medium text-[#112D27]"
            >
              {email || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Action row */}
      <div className="mt-5 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-xl bg-[var(--secondary-color)] px-4 py-3 text-xs text-[var(--primary-color)] sm:flex-1">
          <Info size={15} className="flex-shrink-0" />
          <span>
            تغيير البريد أو رقم الهاتف يتطلب طلب التحقق من فريق أسطى لضمان أمان
            حسابك
          </span>
        </div>

        <Button
          onClick={() => {
            // No backend endpoint yet for change requests — placeholder for now.
          }}
          className="flex-shrink-0 !py-3"
        >
          طلب تغيير
        </Button>
      </div>
    </div>
  );
}
