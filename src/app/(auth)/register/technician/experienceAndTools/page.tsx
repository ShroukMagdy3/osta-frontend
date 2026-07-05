"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import authBg from "@/assets/images/auth-bg.jpg";
import Button from "@/components/ui/Button";
import AuthSelect from "@/components/auth/AuthSelect";
import { api } from "@/api/axios";
import logoImage from '@/assets/images/logo.svg';
import { experienceSchema, validateSchema } from "@/validators/auth.validators";


const STEPS = [
  "المعلومات الأساسية",
  "التخصصات والخدمات",
  "الخبرة و الأدوات",
  "منطقة العمل",
  "التحقق من الهوية",
];
const currentStep = 2;

const EXPERIENCE_OPTIONS = [
  { label: "1-3 سنوات", value: "1" },
  { label: "4-5 سنوات", value: "4" },
  { label: "5-6 سنوات", value: "5" },
  { label: "أكثر من 6 سنوات", value: "7" },
];

const TRANSPORT_OPTIONS = [
  { label: "نعم أمتلك وسيلة مواصلات خاصة", value: "true" },
  { label: "لا أمتلك", value: "false" },
];

const HAVE_TOOLS_OPTIONS = [
  { label: "نعم أمتلك أدوات العمل", value: "true" },
  { label: "لا ينقصني بعض الأدوات", value: "false" },
];

const DAYS_OPTIONS = [
  { label: "السبت", value: "السبت" },
  { label: "الأحد", value: "الأحد" },
  { label: "الاثنين", value: "الاثنين" },
  { label: "الثلاثاء", value: "الثلاثاء" },
  { label: "الأربعاء", value: "الأربعاء" },
  { label: "الخميس", value: "الخميس" },
  { label: "الجمعة", value: "الجمعة" },
];

const HOURS_OPTIONS = [
  { label: "12 ص", value: "12 AM" },
  { label: "1 ص", value: "1 AM" },
  { label: "2 ص", value: "2 AM" },
  { label: "3 ص", value: "3 AM" },
  { label: "4 ص", value: "4 AM" },
  { label: "5 ص", value: "5 AM" },
  { label: "6 ص", value: "6 AM" },
  { label: "7 ص", value: "7 AM" },
  { label: "8 ص", value: "8 AM" },
  { label: "9 ص", value: "9 AM" },
  { label: "10 ص", value: "10 AM" },
  { label: "11 ص", value: "11 AM" },
  { label: "12 م", value: "12 PM" },
  { label: "1 م", value: "1 PM" },
  { label: "2 م", value: "2 PM" },
  { label: "3 م", value: "3 PM" },
  { label: "4 م", value: "4 PM" },
  { label: "5 م", value: "5 PM" },
  { label: "6 م", value: "6 PM" },
  { label: "7 م", value: "7 PM" },
  { label: "8 م", value: "8 PM" },
  { label: "9 م", value: "9 PM" },
  { label: "10 م", value: "10 PM" },
  { label: "11 م", value: "11 PM" },
];

export default function ExperiencePage() {
  const router = useRouter();

  const [experienceYears, setExperienceYears] = useState("");
  const [hasTransport, setHasTransport] = useState("");
  const [hasTools, setHasTools] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [fromHour, setFromHour] = useState("");
  const [toHour, setToHour] = useState("");
  const [error, setError] = useState("");

  // أيام العمل — multi select
  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  // const validate = () => {
  //   if (!experienceYears) {
  //     setError("اختر سنوات الخبرة");
  //     return false;
  //   }
  //   if (!hasTransport) {
  //     setError("اختر إجابة وسيلة المواصلات");
  //     return false;
  //   }
  //   if (!hasTools) {
  //     setError("اختر إجابة الأدوات");
  //     return false;
  //   }
  //   if (selectedDays.length === 0) {
  //     setError("اختر يوم عمل واحد على الأقل");
  //     return false;
  //   }
  //   if (!fromHour || !toHour) {
  //     setError("اختر أوقات العمل");
  //     return false;
  //   }
  //   setError("");
  //   return true;
  // };

  const validate = () => {
  const fieldErrors = validateSchema(experienceSchema, {
    experienceYears,
    hasTransport,
    hasTools,
    selectedDays,
    fromHour,
    toHour,
  });
  if (fieldErrors) {
    setError(Object.values(fieldErrors)[0] || "");
    return false;
  }
  setError("");
  return true;
};

  const handleNext = async () => {
    if (!validate()) return;
    try {
      await api.post("/technician/step3", {
        yearsOfExperience: Number(experienceYears),
        hasTools: hasTools === "true",
        hasTransportation: hasTransport === "true",
        workingDays: selectedDays,
        startTime: fromHour,
        endTime: toHour,
      });
      router.push("/register/technician/work-area");
    } catch (error: any) {
      const message = error.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message[0]
          : message || "حدث خطأ، حاول مرة أخرى",
      );
    }
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

          <p className="text-gray-400 text-xs sm:text-sm text-right mb-6">
            حدد الإجابة على الأسئلة
          </p>

          <div className="flex flex-col gap-4">
            {/* سنوات الخبرة */}
            <AuthSelect
              label="سنوات الخبرة"
              placeholder="اختر سنوات الخبرة"
              options={EXPERIENCE_OPTIONS}
              value={experienceYears}
              onChange={setExperienceYears}
            />

            {/* هل تمتلك وسيلة مواصلات + هل تمتلك الأدوات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthSelect
                label="هل تمتلك وسيلة مواصلات؟"
                placeholder="اختر الإجابة"
                options={TRANSPORT_OPTIONS}
                value={hasTransport}
                onChange={setHasTransport}
              />

              <AuthSelect
                label="هل تمتلك الأدوات اللازمة؟"
                placeholder="اختر الإجابة"
                options={HAVE_TOOLS_OPTIONS}
                value={hasTools}
                onChange={setHasTools}
              />
            </div>

            {/* أيام العمل — multi select بأزرار */}
            <div className="flex flex-col gap-1.5" dir="rtl">
              <label className="text-sm font-medium text-[var(--primary-color)]">
                أيام العمل
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OPTIONS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border-2 transition-all
                      ${
                        selectedDays.includes(day.value)
                          ? "bg-[var(--secondary-color)] border-[var(--primary-color)] text-[var(--primary-color)]"
                          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* أوقات العمل */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthSelect
                label="من الساعة"
                placeholder="من الساعة"
                options={HOURS_OPTIONS}
                value={fromHour}
                onChange={setFromHour}
              />
              <AuthSelect
                label="إلى الساعة"
                placeholder="إلى الساعة"
                options={HOURS_OPTIONS}
                value={toHour}
                onChange={setToHour}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs mt-4 text-right">{error}</p>
          )}

          <div className="h-px bg-gray-100 my-6 sm:my-8" />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => router.back()}>
              إلغاء
            </Button>
            <Button onClick={handleNext}>التالي</Button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}
