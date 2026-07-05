"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import authBg from "@/assets/images/auth-bg.jpg";
import Button from "@/components/ui/Button";
import { api } from "@/api/axios";
import { ChevronLeft, Check } from "lucide-react";
import InfoRow from "@/components/auth/InfoRow";
import logoImage from '@/assets/images/logo.svg';


const STEPS = [
  "المعلومات الأساسية",
  "التخصصات والخدمات",
  "الخبرة و الأدوات",
  "منطقة العمل",
  "التحقق من الهوية",
];
const currentStep = 4;

const DAYS_MAP: Record<string, string> = {
  sat: "السبت",
  sun: "الأحد",
  mon: "الاثنين",
  tue: "الثلاثاء",
  wed: "الأربعاء",
  thu: "الخميس",
  fri: "الجمعة",
};

export default function ReviewPage() {
  const router = useRouter();
  const [techData, setTechData] = useState<any>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("technician/details");
        setTechData(data.data);
        console.log(data.data)
      } catch {
        setError("حدث خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!agreed) {
      setError("يجب الموافقة على الشروط والأحكام");
      return;
    }

    try {
      // await api.post("/technician/submit-application");
      setShowSuccess(true); // بس كده — من غير router.push
    } catch (error: any) {
      const message = error.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message[0]
          : message || "حدث خطأ، حاول مرة أخرى",
      );
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/technician/orders"); // الـ redirect هنا بس
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" dir="ltr">
      <Image
        src={authBg}
        alt="Background"
        fill
        priority
        className="object-cover object-right"
      />
      <div className="absolute inset-0 bg-black/25 lg:hidden" />

      {/* Logo */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="flex items-center gap-2">
          <Image
            src={logoImage}
            alt="Logo"
            width={120}
            // height={60}
            className="h-auto"
          />
        </div>
      </div>

      <div className="flex items-center justify-center z-10 w-full min-h-screen px-4 py-20 lg:w-[55%] lg:px-12 lg:py-12">
        <div
          className="bg-white rounded-3xl shadow-sm w-full p-7 max-w-sm sm:p-10 sm:max-w-md lg:p-12 lg:max-w-2xl"
          dir="rtl"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-color)] text-center mb-10">
            إنشاء حساب فني
          </h1>

          {/* Stepper */}
          <div className="mb-8">
            {/* Mobile + Tablet (Simple Step) */}
            <div className="flex lg:hidden items-center justify-between mb-3">
              <span className="text-xs text-gray-400">
                {currentStep + 1} / {STEPS.length}
              </span>

              <span className="text-sm font-semibold text-[var(--primary-color)]">
                {STEPS[currentStep]}
              </span>
            </div>

            {/* Desktop (Full Steps) */}
            <div className="hidden lg:flex items-center justify-between gap-1 pb-0">
              {STEPS.map((step, index) => (
                <div
                  key={step}
                  className="flex flex-col items-center flex-1 min-w-0"
                >
                  <span
                    className={`
                      text-xs whitespace-nowrap pb-3 transition-all text-center w-full
                      ${
                        index === currentStep
                          ? "text-[var(--primary-color)] font-semibold"
                          : "text-gray-300"
                      }
                    `}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="relative h-0.5 bg-gray-200 w-full">
              <div
                className="absolute top-0 h-0.5 bg-[var(--primary-color)] transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* عنوان المراجعة */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronLeft size={16} className="text-gray-400" />
            </button>
            <h2 className="text-lg font-bold text-[var(--primary-color)]">
              مراجعة الطلب
            </h2>
          </div>
          <p className="text-gray-400 text-xs text-right mb-4">
            راجع بياناتك قبل إرسال طلب الانضمام
          </p>

          {/* البيانات */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : techData ? (
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <InfoRow label="الاسم" value={techData.fullName} />
              <InfoRow label="الهاتف" value={techData.phone} />
              <InfoRow label="البريد الإلكتروني" value={techData.email} />
              <InfoRow label="المحافظة" value={techData.governorate} />
              <InfoRow label="المدينة" value={techData.city} />
              <InfoRow
                label="التخصص"
                value={techData.category || "—"}
              />
              <InfoRow
                label="الخبرة"
                value={
                  techData.yearsOfExperience
                    ? `${techData.yearsOfExperience} سنوات`
                    : "—"
                }
              />
              <InfoRow
                label="أيام العمل"
                value={
                  techData.workingDays
                    ?.map((d: string) => DAYS_MAP[d] || d)
                    .join("، ") || "—"
                }
              />
              <InfoRow
                label="أوقات العمل"
                value={
                  techData.startTime && techData.endTime
                    ? `${techData.startTime} - ${techData.endTime}`
                    : "—"
                }
              />
              <InfoRow
                label="نطاق العمل"
                value={techData.serviceAreas?.join("، ") || "—"}
              />
              <InfoRow
                label="العمل خارج المنطقة"
                value={techData.canWorkOutsideArea ? "نعم" : "لا"}
              />
            </div>
          ) : (
            <p className="text-red-500 text-xs text-right mb-4">{error}</p>
          )}

          {/* الموافقة على الشروط */}
          <label className="flex items-center gap-2 cursor-pointer w-fit ml-auto mb-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setError("");
              }}
              className="w-4 h-4 accent-[var(--accent-color)]"
            />
            <span className="text-xs sm:text-sm text-gray-500">
              أوافق على{" "}
              <span className="text-[var(--primary-color)] font-semibold hover:underline cursor-pointer">
                الشروط والأحكام وسياسة الخصوصية
              </span>
            </span>
          </label>

          {error && (
            <p className="text-red-500 text-xs text-right mb-2">{error}</p>
          )}

          <div className="h-px bg-gray-100 my-4 sm:my-6" />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => router.back()}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>إرسال الطلب</Button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[45%]" />

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center text-center"
            dir="rtl"
          >
            {/* أيقونة النجاح */}
            <div className="w-20 h-20 rounded-full bg-[#F0F9E8] flex items-center justify-center mb-6">
              <Check size={36} className="text-[#8DC63F]" strokeWidth={2.5} />
            </div>

            <h2 className="text-xl font-bold text-[var(--primary-color)] mb-2">
              تم إرسال طلبك بنجاح
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              سيتم مراجعة بياناتك وتفعيل حسابك بعد التحقيق
            </p>

            <Button fullWidth onClick={handleSuccessClose}>
              الذهاب إلى الصفحة الرئيسية
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
