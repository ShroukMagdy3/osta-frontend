"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types/auth.types";
import authBg from "@/assets/images/auth-bg.jpg";
import technicianIcon from "@/assets/icons/technician.svg";
import userIcon from "@/assets/icons/user.svg";
import Image from "next/image";
import Button from "@/components/ui/Button";
import logoImage from "@/assets/images/logo.svg";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    router.push(
      `/register/${selectedRole === "technician" ? "technician" : "user"}`,
    );
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" dir="ltr">
      <Image
        src={authBg}
        alt="Background"
        fill
        priority
        className="object-cover object-right"
      />

      {/* overlay موبايل */}
      <div className="absolute inset-0 bg-black/25 lg:hidden" />

      {/* Logo */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="flex items-center gap-2">
          <Image
            src={logoImage}
            alt="Logo"
            width={120}
            // height={60}
            className="h-auto"
          />
        </div>
      </div>

      {/* الكارت */}
      <div
        className="
        flex items-center justify-center z-10
        w-full min-h-screen px-4 py-20
        lg:w-[55%] lg:px-12 lg:py-12
      "
      >
        <div
          className="
          bg-white rounded-3xl shadow-sm w-full
          p-7 max-w-sm
          sm:p-10 sm:max-w-md
          lg:p-12 lg:max-w-2xl
        "
        >
          <h1
            className="
            font-bold text-[var(--primary-color)] text-center mb-3
            text-2xl sm:text-3xl
          "
          >
            إنشاء حساب جديد
          </h1>
          <p className="text-gray-500 text-center mb-8 sm:mb-10 text-xs sm:text-sm">
            اختر نوع الحساب المناسب للبدء في استخدام منصة أسطى
          </p>

          {/* اختيار الدور */}
          <div className="flex gap-3 sm:gap-4 mb-8 sm:mb-12">
            {/* فني */}
            <button
              onClick={() => setSelectedRole("technician")}
              className={`flex-1 flex flex-col items-center gap-2 sm:gap-3
                p-4 sm:p-6 rounded-2xl border-2 transition-all text-right
                ${
                  selectedRole === "technician"
                    ? "border-[var(--accent-color)] bg-[var(--secondary-color)]"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
            >
              <Image
                src={technicianIcon}
                alt="Technician"
                width={32}
                height={32}
              />
              <span className="font-semibold text-[var(--primary-color)] text-sm sm:text-base">
                فني
              </span>
              <span className="text-xs text-gray-400 text-center leading-relaxed">
                <span className="hidden sm:inline">
                  قدّم خدماتك للعملاء واستقبل طلبات جديدة في تخصصك
                </span>
                <span className="sm:hidden">قدّم خدماتك للعملاء</span>
              </span>
            </button>

            {/* مستخدم */}
            <button
              onClick={() => setSelectedRole("client")}
              className={`flex-1 flex flex-col items-center gap-2 sm:gap-3
                p-4 sm:p-6 rounded-2xl border-2 transition-all text-right
                ${
                  selectedRole === "client"
                    ? "border-[var(--accent-color)] bg-[var(--secondary-color)]"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
            >
              <Image src={userIcon} alt="User" width={32} height={32} />
              <span className="font-semibold text-[var(--primary-color)] text-sm sm:text-base">
                مستخدم
              </span>
              <span className="text-xs text-gray-400 text-center leading-relaxed">
                <span className="hidden sm:inline">
                  اطلب خدمات الصيانة والأعمال المنزلية وتابع طلباتك بسهولة
                </span>
                <span className="sm:hidden">اطلب خدمات الصيانة بسهولة</span>
              </span>
            </button>
          </div>

          {/* زرار المتابعة */}
          <Button onClick={handleContinue} disabled={!selectedRole}>
            المتابعة
          </Button>
        </div>
      </div>

      {/* الجانب الأيمن — desktop only */}
      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}
