"use client";

import Image from "next/image";
import heroBg from "@/assets/images/herobg.jpg";
import CTAButton from "@/components/sections/landing-page/CTAButton";

const techCards = [
  {
    name: "أحمد سامي",
    specialty: "فني سباكة",
    rating: 4.5,
    time: "1 ساعة",
    price: "300 - 400 ج.م",
  },
  {
    name: "محمد عادل",
    specialty: "فني سباكة",
    rating: 4.8,
    price: "300 - 400 ج.م",
    available: true,
  },
];

const progressSteps = [
  { label: "تم تحليل المشكلة", done: true },
  { label: "تم تحديد الخدمة المناسبة", done: true },
  { label: "جار مطابقة الفنيين", done: true },
];

export default function HeroSection() {
  return (
    <section dir="ltr" className="w-full ">
      <div className="relative min-h-[720px] overflow-hidden rounded-bl-[40px] rounded-br-[40px] lg:h-[720px]">
        {/* Background */}
        <Image
          src={heroBg}
          alt="Hero Background"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[var(--primary-color)]/35" />

        {/* Content */}
        {/* Content */}
        <div className="relative z-10 h-full px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-16 lg:pb-0 lg:pt-0">
          <div className="grid h-full items-center gap-10 lg:grid-cols-2">
            {/* LEFT SIDE — Cards */}
            <div className="relative order-2 flex justify-center lg:order-1 lg:justify-start">
              <div className="relative w-full max-w-[470px] rounded-[32px] border border-white/20 bg-white/20 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
                {/* Technician Cards */}
                <div className="space-y-3 sm:space-y-4">
                  {techCards.map((card, index) => (
                    <div
                      key={index}
                      className="bg-white/50 backdrop-blur-lg rounded-[24px] p-4 sm:p-5 shadow-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-right">
                          <h3 className="font-bold text-[var(--primary-color)] text-sm">
                            {card.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {card.specialty}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="font-bold text-sm">
                            {card.rating}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-5 flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <svg
                            className="w-4 h-4 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                            />
                          </svg>
                          {card.price}
                        </div>
                        {card.time && (
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <svg
                              className="w-4 h-4 shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {card.time}
                          </div>
                        )}
                        {card.available && (
                          <div className="flex items-center gap-2 bg-[var(--accent-color)]/20 text-[var(--primary-color)] text-xs font-semibold px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            متاح الآن
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Notification — shown only on lg+ to avoid overflow */}
                <div className="hidden lg:block absolute -right-44 bottom-20 bg-white/70 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-xl max-w-[220px]">
                  <p className="text-sm font-bold text-[var(--primary-color)]">
                    تم العثور على فنيين مناسبين بالقرب منك
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    جار إرسال الطلب واستقبال العروض...
                  </p>
                </div>

                {/* Progress */}
                <div className="mt-6 px-2 sm:mt-10 sm:px-4">
                  <div className="relative">
                    <div className="absolute top-3 left-8 right-8 h-[2px] bg-[var(--accent-color)]/50" />
                    <div className="relative flex justify-between">
                      {progressSteps.map((step, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center text-center"
                        >
                          <div className="w-7 h-7 rounded-full bg-[var(--accent-color)] flex items-center justify-center shadow-md shrink-0">
                            <svg
                              className="w-4 h-4 text-[var(--primary-color)]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-[10px] sm:text-xs text-slate-700 mt-2 sm:mt-3 w-16 sm:w-24 leading-4 sm:leading-5">
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — Headline */}
            <div className="order-1 text-right text-white lg:order-2">
              <h1 className="text-4xl font-black leading-[1.2] sm:text-5xl lg:text-6xl">
                اطلب فني موثوق في
                <br />
                دقائق
              </h1>
              <p className="mr-auto mt-4 max-w-xl text-base leading-7 text-white/85 sm:mt-6 sm:text-lg sm:leading-8 lg:mr-0">
                منصة ذكية تربطك بالحرفيين المناسبين بسرعة، مع تسعير تقديري
                ومتابعة لحالة الطلب لحظة بلحظة.
              </p>
              <div className="mt-6 sm:mt-10 flex justify-end">
                <CTAButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
