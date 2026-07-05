"use client";

import { useRouter } from "next/navigation";
import { ArrowUpLeft } from "lucide-react";
import mailIcon from "@/assets/icons/mail.svg";
import phoneIcon from "@/assets/icons/phone.svg";
import Image from "next/image";
import logoImage from "@/assets/images/logo-light.svg";
import Button from "../ui/Button";
import { useAuth } from "@/hooks/useAuth";



export default function Footer() {
  const router = useRouter();
  const { role, isReady } = useAuth();

  const showEmergencyButton = isReady && role === "client";


  const QUICK_LINKS_COL1 = [
    { label: "من نحن", href: "/about" },
    { label: "كيف تعمل المنصة", href: "/how-it-works" },
    { label: "الأقسام", href: "/client/categories" },
  ];
  
  const QUICK_LINKS_COL2 = [
    { label: "الخدمات الشائعة", href: "/client/categories" },
    { label: "الأسئلة الشائعة", href: role ? `${role}/support?tab=help` : "/login" },
    { label: "الإبلاغ عن مشكلة", href: role ? `${role}/support?tab=tickets` : "/login" },
  ];

  return (
    <footer className="primary-gradient" dir="rtl">
      <div className="mx-auto w-[90%] max-w-7xl px-4 py-10 sm:w-4/5 sm:px-0 sm:py-16 lg:px-0">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={logoImage}
              alt="Logo"
              width={120}
              // height={60}
              className="h-auto"
            />
          </div>
          <p className="text-white/60 text-sm max-w-xs leading-relaxed">
            منصة ذكية تربط العملاء بالحرفيين المؤثوقين، لتوفير خدمات الصيانة
            والأعمال المنزلية بسهولة وسرعة وشفافية.
          </p>
        </div>

        {/* الوسط — روابط سريعة */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-base">روابط سريعة</h3>
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {QUICK_LINKS_COL1.map((link) => (
              <button
                key={link.label}
                onClick={() => router.push(link.href)}
                className="text-white/60 text-sm hover:text-white transition-all text-right"
              >
                {link.label}
              </button>
            ))}
            {QUICK_LINKS_COL2.map((link) => (
              <button
                key={link.label}
                onClick={() => router.push(link.href)}
                className="text-white/60 text-sm hover:text-white transition-all text-right"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* اليسار — تواصل معنا */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-base">تواصل معنا</h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image src={mailIcon} alt="mail" />
              <span className="text-[#FAFAF7] text-sm">support@osta.app</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src={phoneIcon} alt="phone" />
              <span className="text-[#FAFAF7] text-sm" dir="ltr">
              +971 2 304 3333
              </span>
            </div>
          </div>

          {showEmergencyButton && (
            <div className="flex items-center gap-2 w-fit mt-2">
              <Button
                onClick={() => router.push("/client/emergency")}
                className="!text-white !bg-[#D5433E] hover:!bg-[#B83530]"
              >
                ارقام الطوارئ
              </Button>
              <div className="w-9 h-9 rounded-full border-[#D5433E] bg-[#D5433E] hover:bg-[#B83530] flex items-center justify-center">
                <ArrowUpLeft size={16} className="text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-4 h-px w-[90%] bg-white/10 sm:w-4/5" />

      <div
        className="mx-auto flex flex-col gap-3 px-4 py-5 text-center sm:w-4/5 sm:flex-row sm:items-center sm:justify-between sm:px-0 sm:text-right"
        dir="ltr"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 text-white/40 text-xs sm:justify-start">
          <button className="hover:text-white/70 transition-all">
            Cookie Policy
          </button>
          <span>|</span>
          <button className="hover:text-white/70 transition-all">
            privacy policy
          </button>
        </div>
        <p className="text-white/40 text-xs">
          © 2026 أسطى . جميع الحقوق محفوظة
        </p>
      </div>
      </div>
    </footer>
  );
}
