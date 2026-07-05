"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import authBg from "@/assets/images/auth-bg.jpg";
import AuthInput from "@/components/auth/AuthInput";
import Button from "@/components/ui/Button";
import { api } from "@/api/axios";
import logoImage from "@/assets/images/logo.svg";
import {
  resetPasswordSchema,
  validateSchema,
} from "@/validators/auth.validators";

interface ResetForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState<ResetForm>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<ResetForm>>({});
  const [generalError, setGeneralError] = useState("");

  const update = (field: keyof ResetForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // const validate = () => {
  //   const newErrors: Partial<ResetForm> = {};
  //   if (!form.password) newErrors.password = 'كلمة المرور مطلوبة';
  //   if (!form.confirmPassword) newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
  //   if (form.password && form.confirmPassword && form.password !== form.confirmPassword)
  //     newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validate = () => {
    const fieldErrors = validateSchema(resetPasswordSchema, form);
    if (fieldErrors) {
      setErrors(fieldErrors as Partial<ResetForm>);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await api.post("/auth/reset-password", {
        email: localStorage.getItem("reset_email") || "",
        newPassword: form.password,
        confirmPassword: form.confirmPassword,
      });
      router.push("/forgot-password/reset-password/success");
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
        quality={75}
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

      {/* الكارت */}
      <div className="flex items-center justify-center z-10 w-full px-4 py-16 lg:w-[55%] lg:px-12 lg:py-0">
        <div
          className="bg-white rounded-3xl shadow-sm w-full p-7 max-w-sm sm:p-10 sm:max-w-md lg:p-12 lg:max-w-2xl"
          dir="rtl"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-color)] text-center mb-3">
            أنشئ كلمة مرور جديدة
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm text-center mb-8">
            أدخل كلمة مرورك الجديدة
          </p>

          <div className="flex flex-col gap-4">
            <AuthInput
              label="كلمة المرور"
              placeholder="أدخل كلمة المرور الجديدة"
              type="password"
              value={form.password}
              onChange={update("password")}
              error={errors.password}
            />
            <AuthInput
              label="تأكيد كلمة المرور"
              placeholder="أعد إدخال كلمة المرور الجديدة"
              type="password"
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              error={errors.confirmPassword}
            />
          </div>

          <Button fullWidth onClick={handleSubmit} className="mt-6">
            إعادة تعيين كلمة المرور
          </Button>

          {generalError && (
            <p className="text-red-500 text-xs text-center mt-3">
              {generalError}
            </p>
          )}
        </div>
      </div>

      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}
