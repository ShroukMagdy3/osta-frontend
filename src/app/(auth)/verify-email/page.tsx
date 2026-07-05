"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  getCurrentUser,
  resendVerificationEmail,
} from "@/services/auth.service";
import { getPostLoginRoute } from "@/lib/auth-redirect";
import { AuthUser } from "@/types/auth.types";

type ApiError = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
};

export default function VerifyEmailPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const loadUser = async () => {
      try {
        const { data } = await getCurrentUser();
        const currentUser = data.data;

        localStorage.setItem("user", JSON.stringify(currentUser));
        setUser(currentUser);

        if (currentUser.isVerified) {
          router.replace(getPostLoginRoute(currentUser));
          return;
        }
      } catch {
        setError("تعذر تحميل بيانات الحساب. حاول تسجيل الدخول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [router]);

  const handleResend = async () => {
    setSending(true);
    setError("");
    setMessage("");

    try {
      const { data } = await resendVerificationEmail();
      setMessage(data.message || "تم إرسال رسالة التحقق مرة أخرى.");
    } catch (err: unknown) {
      const resendMessage = (err as ApiError).response?.data?.message;
      setError(
        Array.isArray(resendMessage)
          ? resendMessage[0]
          : resendMessage || "تعذر إرسال رسالة التحقق الآن.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    setError("");
    setMessage("");

    try {
      const { data } = await getCurrentUser();
      const currentUser = data.data;

      localStorage.setItem("user", JSON.stringify(currentUser));
      setUser(currentUser);

      if (currentUser.isVerified) {
        router.replace(getPostLoginRoute(currentUser));
        return;
      }

      setMessage("لم يتم تأكيد البريد بعد. افتح الرابط المرسل إلى بريدك ثم حاول مرة أخرى.");
    } catch {
      setError("تعذر التحقق من حالة البريد الآن.");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f7f9f3] flex items-center justify-center px-4"
      dir="rtl"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm p-8 sm:p-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-color)] mb-4">
          أكد بريدك الإلكتروني أولاً
        </h1>
        <p className="text-gray-500 leading-7 mb-2">
          أرسلنا رابط تفعيل إلى:
        </p>
        <p className="text-[var(--primary-color)] font-bold mb-6 break-all">
          {user?.email}
        </p>
        <p className="text-gray-500 text-sm leading-7 mb-8">
          بعد فتح الرسالة والضغط على رابط التفعيل، ارجع هنا واضغط{" "}
          &quot;تم التحقق&quot;.
          {user?.role === "technician"
            ? " لن تتمكن من استكمال خطوات تسجيل الفني قبل تأكيد البريد."
            : " لن تتمكن من متابعة استخدام الحساب قبل تأكيد البريد."}
        </p>

        {message && <p className="text-sm text-green-600 mb-4">{message}</p>}
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button fullWidth onClick={handleCheck} disabled={checking}>
            {checking ? "جاري التحقق..." : "تم التحقق"}
          </Button>
          <Button
            fullWidth
            variant="outline"
            onClick={handleResend}
            disabled={sending}
          >
            {sending ? "جاري الإرسال..." : "إعادة إرسال الرابط"}
          </Button>
        </div>
      </div>
    </div>
  );
}
