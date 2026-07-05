"use client";

import Image from "next/image";
import dQuoteIcon from "@/assets/icons/double-quote.svg";
import person1 from "@/assets/images/personOne.png";
import person2 from "@/assets/images/personTwo.png";
import person3 from "@/assets/images/personThree.png";

const TESTIMONIALS = [
  {
    comment: "تجربة ممتازة، تمكنت من العثور على فني مناسب خلال وقت قصير جدًا.",
    personName: "عماد ياسر",
    personImage: person1,
  },
  {
    comment: "أعجبني وضوح الأسعار وسهولة متابعة الطلب.",
    personName: "محمود محمد",
    personImage: person2,
  },
  {
    comment: "خدمة احترافية وتجربة استخدام بسيطة وسريعة.",
    personName: "يوسف أحمد",
    personImage: person3,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-wrapper bg-[#F4F4F3] !max-w-full" dir="rtl">
      <div className="section-header">
        <h2 className="section-title">ماذا يقول عملاؤنا؟</h2>
        <p className="section-desc">
          تجارب حقيقية من مستخدمين استفادوا من خدمات المنصة.
        </p>
      </div>

      <div className="w-4/5 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.personName}
            className="bg-white rounded-2xl px-5 py-4 flex flex-col items-start text-right gap-4 border-2 border-gray-100 hover:shadow-md transition-all"
          >
            <div
              className="w-12 h-12 rounded-full mr-auto"
            >
              <Image 
                src={dQuoteIcon}
                alt={testimonial.personName}
              />
            </div>

            <p className="text-[#1D293E] text-xs max-w-xs">
              {testimonial.comment}
            </p>

            <div className="flex items-center justify-center gap-2">
                <Image 
                    src={testimonial.personImage}
                    alt={testimonial.personName}
                />
                <p className="text-sm font-bold text-[#1C4B41]">
                    {testimonial.personName}
                </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}