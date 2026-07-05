"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, X } from "lucide-react";
import authBg from "@/assets/images/auth-bg.jpg";
import googleIcon from "@/assets/icons/google.svg";
import AuthInput from "@/components/auth/AuthInput";
import Button from "@/components/ui/Button";
import { registerUser } from "@/services/auth.service";
import AuthSelect from "@/components/auth/AuthSelect";
import logoImage from "@/assets/images/logo.svg";
import {
  userRegisterSchema,
  validateSchema,
} from "@/validators/auth.validators";
import { getPostLoginRoute } from "@/lib/auth-redirect";

type ApiError = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
};

const GOVERNORATES = [
  { label: "القاهرة", value: "القاهرة" },
  { label: "الإسكندرية", value: "الإسكندرية" },
  { label: "الجيزة", value: "الجيزة" },
  { label: "الشرقية", value: "الشرقية" },
  { label: "الدقهلية", value: "الدقهلية" },
  { label: "الإسماعيلية", value: "الإسماعيلية" },
  { label: "الغربية", value: "الغربية" },
  { label: "المنوفية", value: "المنوفية" },
  { label: "البحيرة", value: "البحيرة" },
  { label: "كفر الشيخ", value: "كفر الشيخ" },
  { label: "القليوبية", value: "القليوبية" },
  { label: "الفيوم", value: "الفيوم" },
  { label: "بني سويف", value: "بني سويف" },
  { label: "المنيا", value: "المنيا" },
  { label: "أسيوط", value: "أسيوط" },
  { label: "سوهاج", value: "سوهاج" },
  { label: "قنا", value: "قنا" },
  { label: "الأقصر", value: "الأقصر" },
  { label: "أسوان", value: "أسوان" },
  { label: "البحر الأحمر", value: "البحر الأحمر" },
  { label: "بورسعيد", value: "بورسعيد" },
  { label: "السويس", value: "السويس" },
  { label: "دمياط", value: "دمياط" },
  { label: "شمال سيناء", value: "شمال سيناء" },
  { label: "جنوب سيناء", value: "جنوب سيناء" },
  { label: "الوادي الجديد", value: "الوادي الجديد" },
  { label: "مطروح", value: "مطروح" },
];

interface UserRegisterForm {
  fullName: string;
  gender: string;
  email: string;
  phone: string;
  governorate: string;
  city: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function UserRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<UserRegisterForm>({
    fullName: "",
    gender: "",
    email: "",
    phone: "",
    governorate: "",
    city: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserRegisterForm, string>>
  >({});
  const [showFail, setShowFail] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [formError, setFormError] = useState("");

  const update = (field: keyof UserRegisterForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (formError) setFormError("");
  };

  const validate = () => {
    const fieldErrors = validateSchema(userRegisterSchema, form);
    if (fieldErrors) {
      setErrors(fieldErrors as Partial<Record<keyof UserRegisterForm, string>>);
      setFormError("");
      return false;
    }
    setErrors({});
    setFormError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setFormError("");

    try {
      const { data } = await registerUser({
        fullName: form.fullName,
        gender: form.gender,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone,
        governorate: form.governorate,
        city: form.city,
      });

      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      router.push(getPostLoginRoute(data.data.user));
    } catch (error: unknown) {
      const message = (error as ApiError).response?.data?.message;
      const nextMessage = Array.isArray(message)
        ? message[0]
        : message || "حدث خطأ، حاول مرة أخرى";
      setFailMessage(nextMessage);
      setFormError("");
      setShowFail(true);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
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

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="flex items-center gap-2">
          <Image
            src={logoImage}
            alt="Logo"
            width={120}
            className="h-auto"
          />
        </div>
      </div>

      <div className="flex items-center justify-center z-10 w-full min-h-screen px-4 py-20 lg:w-[55%] lg:px-12 lg:py-8">
        <div
          className="bg-white rounded-3xl shadow-sm w-full p-7 max-w-sm sm:p-10 sm:max-w-md lg:p-12 lg:max-w-2xl"
          dir="rtl"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-color)] text-center mb-3">
            إنشاء حساب مستخدم
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm text-center mb-8">
            أنشئ حسابك للوصول إلى الحرفيين المؤهلين وطلب الخدمات بسهولة.
          </p>

          {formError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 text-right">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="الاسم بالكامل"
                placeholder="ادخل الاسم الرباعي"
                type="text"
                value={form.fullName}
                onChange={update("fullName")}
                error={errors.fullName}
              />
              <AuthSelect
                label="النوع"
                placeholder="اختر النوع"
                value={form.gender}
                onChange={update("gender")}
                error={errors.gender}
                options={[
                  { label: "ذكر", value: "male" },
                  { label: "أنثى", value: "female" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="البريد الإلكتروني"
                placeholder="Ex: user@example.com"
                type="email"
                value={form.email}
                onChange={update("email")}
                error={errors.email}
              />
              <AuthInput
                label="رقم الهاتف"
                placeholder="+00 0000 000000"
                type="tel"
                icon={Phone}
                value={form.phone}
                onChange={update("phone")}
                error={errors.phone}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthSelect
                label="المحافظة"
                placeholder="اختر محافظتك"
                options={GOVERNORATES}
                value={form.governorate}
                onChange={(val) => {
                  setForm((prev) => ({ ...prev, governorate: val, city: "" }));
                }}
                error={errors.governorate}
              />
              <AuthInput
                label="المدينة"
                placeholder="اكتب مدينتك"
                value={form.city}
                onChange={update("city")}
                error={errors.city}
                disabled={!form.governorate}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="كلمة المرور"
                placeholder="ادخل كلمة المرور"
                type="password"
                value={form.password}
                onChange={update("password")}
                error={errors.password}
              />
              <AuthInput
                label="تأكيد كلمة المرور"
                placeholder="أعد إدخال كلمة المرور"
                type="password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                error={errors.confirmPassword}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={form.agreeToTerms}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      agreeToTerms: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[var(--accent-color)] cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-gray-500">
                  أوافق على{" "}
                  <span className="text-[var(--primary-color)] font-semibold cursor-pointer hover:underline">
                    الشروط والأحكام وسياسة الخصوصية
                  </span>
                </span>
              </label>
              {errors.agreeToTerms && (
                <span className="text-xs text-red-500 mr-6">
                  {errors.agreeToTerms}
                </span>
              )}
            </div>
          </div>

          <Button fullWidth onClick={handleSubmit} className="mt-6">
            إنشاء حساب
          </Button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">أو</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={handleGoogleRegister}
            className="w-full py-2.5 rounded-full border border-gray-200 flex items-center justify-center gap-2 bg-[#F1F7E7] hover:bg-[#E7F1D8] transition-all"
          >
            <Image src={googleIcon} alt="Google" width={18} height={18} />
            <span className="text-sm text-gray-600 font-medium">
              المتابعة عبر جوجل
            </span>
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-400 mt-5">
            لديك حساب بالفعل؟ قم{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-[var(--primary-color)] font-bold cursor-pointer hover:underline"
            >
              بالضغط هنا
            </span>{" "}
            لتسجيل الدخول
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[45%]" />

      {showFail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center text-center"
            dir="rtl"
          >
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <X size={36} className="text-red-500" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-[var(--primary-color)] mb-2">
              فشل إنشاء الحساب
            </h2>
            <p className="text-gray-400 text-sm mb-8">{failMessage}</p>
            <Button fullWidth onClick={() => setShowFail(false)}>
              حاول مرة أخرى
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
