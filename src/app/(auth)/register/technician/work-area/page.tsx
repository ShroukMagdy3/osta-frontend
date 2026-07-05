"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin } from "lucide-react";
import authBg from "@/assets/images/auth-bg.jpg";
import Button from "@/components/ui/Button";
import AuthSelect from "@/components/auth/AuthSelect";
import AuthInput from "@/components/auth/AuthInput";
import { api } from "@/api/axios";
import { workAreaSchema, validateSchema } from "@/validators/auth.validators";

const STEPS = [
  "المعلومات الأساسية",
  "التخصصات والخدمات",
  "الخبرة و الأدوات",
  "منطقة العمل",
  "التحقق من الهوية",
];
const currentStep = 3;

const OUTSIDE_OPTIONS = [
  { label: "نعم أستطيع العمل خارج منطقتي", value: "true" },
  { label: "لا أفضل العمل في منطقتي فقط", value: "false" },
];

export default function WorkAreaPage() {
  const router = useRouter();
  const [workRange, setWorkRange] = useState("");
  const [canWorkOutside, setCanWorkOutside] = useState("");
  const [error, setError] = useState("");

  // const validate = () => {
  //   if (!workRange.trim()) {
  //     setError("حدد نطاق العمل");
  //     return false;
  //   }
  //   if (!canWorkOutside) {
  //     setError("اختر إجابة العمل خارج المنطقة");
  //     return false;
  //   }
  //   setError("");
  //   return true;
  // };

  const validate = () => {
    const fieldErrors = validateSchema(workAreaSchema, {
      workRange,
      canWorkOutside,
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
      await api.post("/technician/step4", {
        serviceAreas: [workRange],
        canWorkOutsideArea: canWorkOutside === "true",
      });
      router.push("/register/technician/identity-verification");
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

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--primary-color)] sm:text-lg">
            أُسطى
          </span>
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#8DC63F] rounded-sm" />
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
            حدد المناطق التي يمكنك تقديم خدماتك بها.
          </p>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="نطاق العمل"
                placeholder="حدد نطاق العمل"
                icon={MapPin}
                value={workRange}
                onChange={setWorkRange}
              />
              <AuthSelect
                label="هل تستطيع العمل خارج منطقتك؟"
                placeholder="اختر الإجابة"
                options={OUTSIDE_OPTIONS}
                value={canWorkOutside}
                onChange={setCanWorkOutside}
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
