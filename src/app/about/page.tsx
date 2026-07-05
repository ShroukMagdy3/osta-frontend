import LandingNavbar from "@/components/sections/landing-page/Navbar";
import Footer from "@/components/layout/Footer";
import "@/styles/sectionsLayout.css";

export const metadata = {
  title: "من نحن | أسطى",
  description: "تعرف على منصة أسطى ورسالتها وفريقها",
};

const teamMembers = [
  { name: "سهيلة", role: "Full Stack MERN Developer", initial: "س" },
  { name: "فاطمة", role: "Full Stack MERN Developer", initial: "ف" },
  { name: "هاجر", role: "Full Stack MERN Developer", initial: "ه" },
  { name: "شروق", role: "Full Stack MERN Developer", initial: "ش" },
  { name: "نهال", role: "Full Stack MERN Developer", initial: "ن" },
  { name: "يمنى", role: "UI/UX Designer", initial: "ي" },
  { name: "إسراء", role: "QA Tester", initial: "إ" },
  { name: "رفيدة", role: "QA Tester", initial: "ر" },
];

const values = [
  {
    title: "الموثوقية",
    description: "نعمل مع حرفيين موثّقين ومُقيَّمين لضمان أعلى جودة خدمة.",
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
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "الشفافية",
    description:
      "أسعار واضحة ومسبقة بدون مفاجآت — تعرف التكلفة قبل تأكيد أي طلب.",
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
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
  },
  {
    title: "السرعة",
    description:
      "نربطك بالحرفي المناسب في دقائق عبر خوارزمية ذكاء اصطناعي متطورة.",
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
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "الابتكار",
    description:
      "نستخدم تقنيات الذكاء الاصطناعي لتشخيص المشكلة وتقديم الحل الأنسب.",
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
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" dir="rtl">
      <LandingNavbar />

      {/* Hero */}
      {/* Hero */}
      <section className="primary-gradient pt-36 pb-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-[var(--accent-color)] bg-white/10 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            نحن
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            منصة ذكية لخدمات
            <br />
            الصيانة المنزلية
          </h1>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            أسطى هي منصة رقمية تربط العملاء بالحرفيين المؤهلين والموثوقين،
            بطريقة سهلة وشفافة وسريعة — مدعومة بالذكاء الاصطناعي.
          </p>
        </div>
      </section>

      

      {/* Values */}
      <section className="bg-[#f7f9f3] py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-5 leading-snug">
              رسالتنا
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              نؤمن بأن الحصول على خدمة صيانة جيدة يجب أن يكون سهلاً وسريعاً
              وموثوقاً. لهذا بنينا أسطى — منصة تجمع بين قوة الذكاء الاصطناعي
              وشبكة واسعة من الحرفيين المتحقق منهم.
            </p>
            <p className="text-gray-500 text-base leading-relaxed">
              نهدف إلى تحويل تجربة طلب الخدمات المنزلية من عملية مرهقة ومقلقة
              إلى رحلة سلسة تنتهي بنتيجة مضمونة.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col gap-5">
              {[
                "تشخيص ذكي للمشكلة باستخدام الذكاء الاصطناعي",
                "مطابقة فورية مع أقرب الحرفيين المؤهلين",
                "تسعير تقديري شفاف قبل بدء العمل",
                "متابعة حالة الطلب لحظة بلحظة",
                "تقييم الخدمة وضمان جودة العمل",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-color)] flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-[var(--primary-color)]"
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
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              قيمنا
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
              المبادئ التي تقود كل قرار نتخذه وكل ميزة نطورها في أسطى.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-[#f0f7e6] rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[var(--primary-color)] shadow-sm ml-auto">
                  {value.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-black text-gray-900 text-sm sm:text-base leading-snug text-right">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed text-right">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">فريقنا</h2>
          <p className="section-desc">الأشخاص الذين يقفون خلف منصة أسطى</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {teamMembers.map((m) => (
            <div
              key={m.name}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white text-2xl font-black">
                {m.initial}
              </div>
              <div>
                <p className="font-bold text-[var(--primary-color)] text-sm">
                  {m.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
