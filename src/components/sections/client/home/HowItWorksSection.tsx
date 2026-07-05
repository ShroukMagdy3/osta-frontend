"use client";

import Brain from "@/assets/icons/howItWork(1).svg";
import Users from "@/assets/icons/howItWork(2).svg";
import DollarSign from "@/assets/icons/howItWork(3).svg";
import ClipboardList from "@/assets/icons/howItWork(4).svg";
import Image from "next/image";

const FEATURES = [
  {
    icon: Brain,
    title: "تشخيص ذكي للمشكلة",
    desc: "يساعدك في تحديد نوع الخدمة المناسبة بناء على وصف المشكلة.",
  },
  {
    icon: Users,
    title: "مطابقة للحرفيين",
    desc: "اقتراح الحرفيين المناسبين حسب نوع الخدمة والموقع.",
  },
  {
    icon: DollarSign,
    title: "أسعار تقديرية واضحة",
    desc: "الحصول على نطاق سعري متوقع قبل تأكيد الطلب.",
  },
  {
    icon: ClipboardList,
    title: "متابعة حالة الطلب",
    desc: "متابعة مراحل تنفيذ الخدمة بسهولة.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="section-wrapper w-full lg:w-4/5" dir="rtl">
      <div className="section-header">
        <h2 className="section-title">كيف يساعدك أوسطى</h2>
        <p className="section-desc">
          نساعدك في العثور على الحرفي المناسب من خلال أدوات ذكية وتجربة استخدام بسيطة.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-2xl p-6 flex flex-col items-start text-right gap-4 border-2 border-gray-100 hover:shadow-md transition-all"
          >
            
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--secondary-color)]">
              <Image 
                src={feature.icon}
                alt={feature.title}
              />
            </div>

            <p className="font-bold text-[var(--primary-color)] text-base">
              {feature.title}
            </p>

            <p className="text-gray-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}