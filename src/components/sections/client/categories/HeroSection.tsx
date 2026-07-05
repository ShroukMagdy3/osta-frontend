"use client";

import Image from "next/image";
import heroImage from "@/assets/images/cat-bg.jpg";
import Navbar from "@/components/layout/client/Navbar";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[40vh]" dir="rtl">
      {/* الصورة */}
      <Image
        src={heroImage}
        alt="Hero Background"
        fill
        priority
        className="object-cover object-center"
      />

      {/* الناف بار فوق كل حاجة */}
      <div className="relative lg:p-5 z-20">
        <Navbar />
      </div>

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent" />

      {/* المحتوى */}
      <div className="relative z-10 flex items-center justify-start px-8 md:px-16 lg:px-24 pb-16 pt-4">
        <div className="text-right">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            الأقسام الرئيسية
          </h1>
          <p className="max-w-md text-white/80 text-sm md:text-base leading-relaxed">
            اختر القسم المناسب للوصول إلى الخدمات المتاحة ضمن تخصصات الصيانة والأعمال المنزلية.
          </p>
        </div>
      </div>
    </section>
  );
}