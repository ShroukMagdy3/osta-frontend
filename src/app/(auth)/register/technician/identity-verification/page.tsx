"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import authBg from "@/assets/images/auth-bg.jpg";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/auth/FileUpload";
import { api } from "@/api/axios";
import logoImage from "@/assets/images/logo.svg";
import { identitySchema, validateSchema } from "@/validators/auth.validators";

const STEPS = [
  "المعلومات الأساسية",
  "التخصصات والخدمات",
  "الخبرة و الأدوات",
  "منطقة العمل",
  "التحقق من الهوية",
];
const currentStep = 4;

interface IdentityFiles {
  idFrontImage: File | null;
  idBackImage: File | null;
  personalImage: File | null;
  certificateImage: File | null;
  criminalRecordImage: File | null;
}

export default function IdentityPage() {
  const router = useRouter();

  const [files, setFiles] = useState<IdentityFiles>({
    idFrontImage: null,
    idBackImage: null,
    personalImage: null,
    certificateImage: null,
    criminalRecordImage: null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof IdentityFiles, string>>
  >({});
  const [generalError, setGeneralError] = useState("");

  const update = (field: keyof IdentityFiles) => (file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // const validate = () => {
  //   const newErrors: Partial<Record<keyof IdentityFiles, string>> = {};
  //   if (!files.idFrontImage) newErrors.idFrontImage = 'صورة البطاقة الأمامية مطلوبة';
  //   if (!files.idBackImage) newErrors.idBackImage = 'صورة البطاقة الخلفية مطلوبة';
  //   if (!files.personalImage) newErrors.personalImage = 'صورة السيلفي مع البطاقة مطلوبة';
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validate = () => {
    const fieldErrors = validateSchema(identitySchema, files);
    if (fieldErrors) {
      setErrors(fieldErrors as Partial<Record<keyof IdentityFiles, string>>);
      return false;
    }
    setErrors({});
    return true;
  };
  const handleNext = async () => {
    if (!validate()) return;
    try {
      const formData = new FormData();
      if (files.idFrontImage)
        formData.append("idFrontImage", files.idFrontImage);
      if (files.idBackImage) formData.append("idBackImage", files.idBackImage);
      if (files.personalImage)
        formData.append("personalImage", files.personalImage);
      if (files.certificateImage)
        formData.append("certificateImage", files.certificateImage);
      if (files.criminalRecordImage)
        formData.append("criminalRecordImage", files.criminalRecordImage);

      await api.post("/technician/step5", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/register/technician/review-application");
    } catch (error: any) {
      const message = error.response?.data?.message;
      setGeneralError(
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
            لضمان جودة وأمان الخدمات، يرجى رفع المستندات المطلوبة لتوثيق حسابك.
          </p>

          <div className="flex flex-col gap-4">
            {/* البطاقة الشخصية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUpload
                label="صورة البطاقة الشخصية (أمامية)"
                value={files.idFrontImage}
                onChange={update("idFrontImage")}
                error={errors.idFrontImage}
              />
              <FileUpload
                label="صورة البطاقة الشخصية (خلفية)"
                value={files.idBackImage}
                onChange={update("idBackImage")}
                error={errors.idBackImage}
              />
            </div>

            {/* سيلفي مع البطاقة */}
            <FileUpload
              label="صورة سيلفي مع البطاقة الشخصية"
              value={files.personalImage}
              onChange={update("personalImage")}
              error={errors.personalImage}
            />

            {/* شهادة تثبت الخبرة */}
            <FileUpload
              label="شهادة تثبت الخبرة (اختياري)"
              value={files.certificateImage}
              onChange={update("certificateImage")}
            />

            {/* فيش وتشبيه */}
            <FileUpload
              label="فيش وتشبيه (اختياري)"
              value={files.criminalRecordImage}
              onChange={update("criminalRecordImage")}
            />
          </div>

          {generalError && (
            <p className="text-red-500 text-xs mt-4 text-right">
              {generalError}
            </p>
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
