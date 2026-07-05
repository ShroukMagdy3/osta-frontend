"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import authBg from "@/assets/images/auth-bg.jpg";
import Button from "@/components/ui/Button";
import { api } from "@/api/axios";
import logoImage from "@/assets/images/logo.svg";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [error, setError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const email = localStorage.getItem("reset_email") || "";
    // بتحولي الإيميل لـ masked: hajarzain@gmail.com → haj***@gmail.com
    const [user, domain] = email.split("@");
    const masked = user.slice(0, 3) + "***@" + domain;
    setMaskedEmail(masked);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // أرقام بس
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // حرف واحد بس
    setOtp(newOtp);
    // انتقل للـ input الجاي تلقائي
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // لو backspace وفاضي، ارجع للسابق
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .slice(0, OTP_LENGTH)
      .split("");
    if (pasted.every((c) => /\d/.test(c))) {
      setOtp([...pasted, ...Array(OTP_LENGTH - pasted.length).fill("")]);
      inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();

    const email = localStorage.getItem("reset_email") || "";
    await api.post("/auth/forget-password", { email });
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) return;

    try {
      const email = localStorage.getItem("reset_email") || "";
      await api.post("/auth/verify-otp", { email, otp: code });
      router.push("/forgot-password/reset-password");
    } catch (error: any) {
      const message = error.response?.data?.message;
      setError(
        Array.isArray(message) ? message[0] : message || "رمز التحقق غلط",
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
            تأكيد رمز التحقق
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm text-center mb-8">
            لقد أرسلنا رمز تحقق إلى بريدك الإلكتروني{" "}
            <span className="text-[var(--primary-color)] font-semibold">
              {maskedEmail}
            </span>
          </p>

          {/* OTP inputs */}
          <div
            className="flex justify-center gap-3 sm:gap-4 mb-8"
            dir="ltr"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  w-10 h-10 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl border-2 outline-none transition-all              
                  ${
                    digit
                      ? "border-[var(--accent-color)] text-[var(--primary-color)]"
                      : "border-gray-200 text-gray-400"
                  }
                  focus:border-[var(--accent-color)]
                `}
              />
            ))}
          </div>

          {/* زرار متابعة */}
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={otp.join("").length < OTP_LENGTH}
          >
            متابعة
          </Button>

          {/* Resend */}
          <div className="text-center mt-5">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">
              لم تستلم الرمز؟
            </p>
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-[var(--primary-color)] font-bold text-sm hover:underline"
              >
                أعد الإرسال
              </button>
            ) : (
              <p className="text-xs text-gray-400">
                أعد الإرسال في خلال{" "}
                <span className="text-[var(--primary-color)] font-semibold">
                  {timer} ث
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[45%]" />

      {error && (
        <p className="text-red-500 text-xs text-center mt-3">{error}</p>
      )}
    </div>
  );
}
