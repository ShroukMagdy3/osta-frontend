"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQUESTIONS = [
  {
    question: "كيف تعمل منصة أسطى؟",
    answer:
      "اختر الخدمة أو صف المشكلة، استقبل عروض الحرفيين المناسبين، ثم اختر العرض الأنسب وتابع تنفيذ الخدمة حتى الانتهاء منها.",
  },
  {
    question: "كيف يتم تحديد السعر؟",
    answer: "يتم عرض سعر تقديري بناءً على نوع الخدمة وتفاصيل المشكلة.",
  },
  {
    question: "هل يمكنني اختيار الحرفي؟",
    answer: "نعم، يمكنك مراجعة العروض واختيار الحرفي المناسب.",
  },
  {
    question: "هل يمكن التواصل مع الحرفي؟",
    answer: "نعم، تتوفر محادثة داخلية بعد قبول الطلب.",
  },
  {
    question: "ماذا إذا احتاجت الخدمة لتكاليف إضافية؟",
    answer: "سيقوم الحرفي بتوضيح أي تكاليف إضافية قبل اعتمادها.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="section-wrapper w-full lg:w-1/2" dir="rtl">
      <div className="section-header">
        <h2 className="section-title">الأسئلة الشائعة</h2>
      </div>

      <div className="flex flex-col gap-3">
        {FAQUESTIONS.map((q, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={q.question}
              className="rounded-4xl overflow-hidden transition-all"
              style={{
                backgroundColor: isOpen
                  ? "var(--accent-color)"
                  : "var(--secondary-color)",
              }}
            >

              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center gap-3 px-6 py-4"
              >

                 <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                    `}
                >
                  {isOpen ? (
                    <Minus
                      size={24}
                      className="text-[var(--primary-color)]"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Plus
                      size={24}
                      className="text-[var(--primary-color)]"
                      strokeWidth={2.5}
                    />
                  )}
                </div>

                <span
                  className={`text-sm sm:text-base text-right
                    ${isOpen ? "font-bold" : "font-semibold"} text-[var(--primary-color)]`}
                >
                  {q.question}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pr-16">
                  <p className="text-[#545454] text-sm leading-relaxed text-right">
                    {q.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
