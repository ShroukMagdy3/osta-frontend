"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import authBg from "@/assets/images/auth-bg.jpg";
import googleIcon from "@/assets/icons/google.svg";
import AuthInput from "@/components/auth/AuthInput";
import Button from "@/components/ui/Button";
import { loginUser } from "@/services/auth.service";
import logoImage from "@/assets/images/logo.svg";
import { loginSchema, validateSchema } from "@/validators/auth.validators";
import { getPostLoginRoute } from "@/lib/auth-redirect";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [generalError, setGeneralError] = useState("");

  const update = (field: keyof LoginForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (generalError) setGeneralError("");
  };

  const validate = () => {
    const fieldErrors = validateSchema(loginSchema, form);
    if (fieldErrors) {
      setErrors(fieldErrors as Partial<LoginForm>);
      setGeneralError("");
      return false;
    }
    setErrors({});
    setGeneralError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const { data } = await loginUser({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      router.push(getPostLoginRoute(data.data.user));
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      const message = (error as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      const resolvedMessage = Array.isArray(message)
        ? message[0]
        : message || "حدث خطأ، حاول مرة أخرى";

      setErrors({});
      if (status === 401 || status === 403 || /invalid|wrong|incorrect|unauthorized|password/i.test(resolvedMessage)) {
        setGeneralError("البريد أو كلمة المرور غير صحيحة");
      } else {
        setGeneralError(resolvedMessage);
      }
    }
  };

  const handleGoogleLogin = () => {
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
          <Image src={logoImage} alt="Logo" width={120} className="h-auto" />
        </div>
      </div>

      <div
        className="
        flex items-center justify-center z-10
        w-full px-4 py-16
        lg:w-[55%] lg:px-12 lg:py-0
      "
      >
        <div
          className="
          bg-white rounded-3xl shadow-sm w-full
          p-7 max-w-sm
          sm:p-10 sm:max-w-md
          lg:p-12 lg:max-w-2xl
        "
          dir="rtl"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-color)] text-center mb-3">
            تسجيل الدخول
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm text-center mb-8">
            سجل دخولك إلى حسابك الشخصي
          </p>

          {generalError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 text-right">
              {generalError}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <AuthInput
              label="البريد الإلكتروني"
              placeholder="Ex: user@example.com"
              type="email"
              value={form.email}
              onChange={update("email")}
              error={errors.email}
            />
            <AuthInput
              label="كلمة المرور"
              placeholder="أدخل كلمة المرور"
              type="password"
              value={form.password}
              onChange={update("password")}
              error={errors.password}
            />
          </div>

          <button
            onClick={() => router.push("/forgot-password")}
            className="text-xs text-[var(--primary-color)] font-semibold mt-3 hover:underline block"
          >
            نسيت كلمة المرور؟
          </button>

          <Button fullWidth onClick={handleSubmit} className="mt-6">
            تسجيل الدخول
          </Button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">أو</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 rounded-full border border-gray-200 flex items-center justify-center gap-2 bg-[#F1F7E7] hover:bg-[#E7F1D8] transition-all"
          >
            <Image src={googleIcon} alt="Google" width={18} height={18} />
            <span className="text-sm text-gray-600 font-medium">
              سجل الدخول عبر جوجل
            </span>
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-400 mt-5">
            لا يوجد لديك حساب؟ قم{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-[var(--primary-color)] font-bold cursor-pointer hover:underline"
            >
              بالضغط هنا
            </span>{" "}
            لتسجيل حساب
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}
