import Image from "next/image";
import aibg from "@/assets/images/ail.png";
import CTAButton from "@/components/sections/landing-page/CTAButton";

export default function AIDiagnosis() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden py-16 lg:py-24 px-4 sm:px-6"
      style={{
        background:
          "linear-gradient(90deg,#1B5647 0%, #205C4C 50%, #1B5647 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* RIGHT — Content */}
          <div className="order-1">
            <div className="text-right">
              <h2 className="text-white font-black text-3xl sm:text-4xl lg:text-5xl mb-4">
                التشخيص الذكي للمشكلة
              </h2>
              <p className="text-white/60 text-base lg:text-lg">
                تقنيات ذكية تساعدك في تحديد الخدمة المناسبة بشكل أسرع وأسهل.
              </p>
            </div>

            {/* Chat Card */}
            <div className="mt-8 w-full max-w-[520px] rounded-[28px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl lg:mt-12">
              {/* Message Area */}
              <div className="rounded-[20px] bg-white/10 min-h-[120px] lg:min-h-[140px] p-4 sm:p-6">
                <p className="text-right text-white/90 leading-8 text-sm sm:text-base">
                  يوجد تسريب مياه أسفل الحوض والمياه لا تتوقف
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3 mt-4 flex-wrap">
                <button className="bg-[var(--accent-color)] text-[var(--primary-color)] rounded-full px-4 sm:px-5 py-2 text-sm font-bold flex items-center gap-2">
                  رفع صورة
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  />
                </button>

                <button className="border border-white/30 text-white rounded-full px-4 sm:px-5 py-2 text-sm flex items-center gap-2">
                  تسجيل صوتي
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 lg:mt-16 flex">
              <CTAButton href="/login" />
            </div>
          </div>

          {/* LEFT — Image */}
          <div className="order-2 flex justify-center lg:justify-end">
            {/*
              On mobile: no relative overflow tricks, chips hidden, bubble shown below image.
              On lg+: original absolute-positioned decorative elements restored.
            */}

            {/* Mobile layout */}
            <div className="flex w-full flex-col items-center gap-6 lg:hidden">
              <Image
                src={aibg}
                alt="AI Diagnosis"
                width={500}
                height={460}
                className="h-auto w-full max-w-[420px] rounded-[30px] object-cover shadow-2xl"
              />

              {/* Bubble shown below image on mobile */}
              <div className="w-full max-w-[420px] rounded-[24px] border border-white/20 bg-white/20 p-4 backdrop-blur-xl">
                <p className="text-right text-white leading-7 text-sm">
                  يبدو أن المشكلة مرتبطة بخدمة سباكة وقد تحتاج إلى فحص السيفون
                  أو تغيير بعض التوصيلات
                </p>
              </div>
            </div>

            {/* Desktop layout — original decorative positioning preserved */}
            <div className="relative hidden w-fit lg:block">
              <Image
                src={aibg}
                alt="AI Diagnosis"
                width={500}
                height={500}
                className="rounded-[30px] object-cover h-[460px] w-[500px] shadow-2xl"
              />

              {/* Chip 1 */}
              <div className="absolute -right-28 top-24 bg-white/15 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2 text-white text-sm">
                تغيير سيفون
              </div>

              {/* Chip 2 */}
              <div className="absolute -right-20 top-52 bg-white/15 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2 text-white text-sm">
                إصلاح تسريب
              </div>

              {/* Bubble */}
              <div className="absolute -bottom-2 left-60 w-[340px] rounded-[24px] bg-white/20 backdrop-blur-xl border border-white/20 p-5">
                <p className="text-right text-white leading-8 text-sm">
                  يبدو أن المشكلة مرتبطة بخدمة سباكة وقد تحتاج إلى فحص السيفون
                  أو تغيير بعض التوصيلات
                </p>
              </div>

              {/* Dashed SVG 1 */}
              <svg
                className="absolute -right-6 top-6"
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
              >
                <path
                  d="M10 10C60 10 70 40 80 80"
                  stroke="white"
                  strokeDasharray="6 6"
                  strokeWidth="2"
                />
              </svg>

              {/* Dashed SVG 2 */}
              <svg
                className="absolute -right-8 top-30"
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path
                  d="M10 10C80 20 70 80 90 110"
                  stroke="white"
                  strokeDasharray="6 6"
                  strokeWidth="2"
                />
              </svg>

              {/* Dashed SVG 3 */}
              <svg
                className="absolute -right-50 bottom-20"
                width="140"
                height="80"
                viewBox="0 0 140 80"
                fill="none"
              >
                <path
                  d="M130 10C80 10 80 70 10 70"
                  stroke="white"
                  strokeDasharray="6 6"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
