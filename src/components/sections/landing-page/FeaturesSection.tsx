const features = [
  {
    title: "تحليل ذكي للمشكلة",
    description:
      "اكتب مشكلتك أو أرسل صورة، وسيساعدك النظام في تحديد الخدمة المناسبة.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "وصول أسرع للحرفيين",
    description:
      "مطابقة ذكية للحرفيين الأقرب، والأجدر مناسبة حسب نوع الخدمة والموقع.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: "أسعار أكثر وضوحًا",
    description: "الحصول على نطاق سعري للتحريم قبل تأكيد الطلب.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "متابعة مباشرة للطلب",
    description: "تابع حالة الطلب لحظة بلحظة دون انتظار أو قلق.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20 px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            حلول ذكية للخدمات المنزلية بدون تعقيد
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto">
            في أسطى نربطك بالحرفي المناسب بسرعة، مع تجربة تعتمد على التحليل
            الذكي، التسعير التقديري وتتبع حالة الطلب خطوة بخطوة.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-[#f0f7e6] rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[var(--primary-color)] shadow-sm ml-auto">
                {feature.icon}
              </div>
              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className="font-black text-gray-900 text-sm sm:text-base leading-snug text-right">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed text-right">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
