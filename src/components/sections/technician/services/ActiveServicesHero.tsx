"use client";

import Navbar from "@/components/layout/technician/Navbar";

export default function HeroSection() {
  return (
    <section
      className="primary-gradient relative w-full min-h-[30vh]"
      dir="rtl"
    >
      {/* الناف بار فوق كل حاجة */}
      <div className="relative lg:p-5 z-20">
        <Navbar />
      </div>

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* المحتوى */}
      <div className="relative z-10 flex items-center justify-start px-8 md:px-16 lg:px-24 pb-16 pt-4">
        <div className="text-right">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            الخدمات النشطة
          </h1>
          <p className="max-w-md text-white/80 text-sm md:text-base leading-relaxed">
            الخدمات الجارية التي تعمل عليها حاليًا، مع إمكانية متابعة حالتها
            وتحديث تقدمها.
          </p>
        </div>
      </div>
    </section>
  );
}