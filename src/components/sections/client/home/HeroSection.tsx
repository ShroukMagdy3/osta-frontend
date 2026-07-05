"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpLeft } from "lucide-react";
import heroImage from "@/assets/images/hero-bg.png";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/client/Navbar";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      className="relative w-full min-h-[80vh] overflow-hidden" dir="rtl">
      <Image
        src={heroImage}
        alt="Hero Background"
        fill
        priority
        className="object-cover object-center rounded-b-4xl"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent" />

      {/* الناف بار فوق كل حاجة */}
      <div className="relative lg:p-5 z-10">
        <Navbar />
      </div>

      {/* overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent" /> */}
      
      {/* المحتوى */}
      <div className="absolute inset-0 flex items-center justify-start">
        <div className="px-4 py-8 text-right sm:px-8 md:px-16 lg:px-24">
          <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl">
            مرحبًا بك في أُسطى
          </h1>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
            ابحث عن الحرفي المناسب أو استعرض الخدمات المتاحة لإنجاز أعمال
            الصيانة والأعمال المنزلية بسهولة.
          </p>

          <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4">
            <Button
              onClick={() => router.push("/client/smart-request")}
              className="!h-12 !w-full sm:!w-70"
            >
              الطلب الذكي
            </Button>
            <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] hover:bg[var(--accent-hover)] flex items-center justify-center">
              <ArrowUpLeft size={20} className="text-[var(--primary-color)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
