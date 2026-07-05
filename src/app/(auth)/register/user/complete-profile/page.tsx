"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, X } from "lucide-react";
import authBg from "@/assets/images/auth-bg.jpg";
import logoImage from "@/assets/images/logo.svg";
import AuthInput from "@/components/auth/AuthInput";
import AuthSelect from "@/components/auth/AuthSelect";
import Button from "@/components/ui/Button";
import {
  completeClientProfile,
  getCurrentUser,
} from "@/services/auth.service";
import { getPostLoginRoute } from "@/lib/auth-redirect";
import {
  clientGoogleCompletionSchema,
  validateSchema,
} from "@/validators/auth.validators";
import { AuthUser } from "@/types/auth.types";

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

interface CompletionForm {
  phone: string;
  governorate: string;
  city: string;
  gender: string;
}

export default function CompleteClientProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<CompletionForm>({
    phone: "",
    governorate: "",
    city: "",
    gender: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CompletionForm, string>>
  >({});
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [failMessage, setFailMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const syncUser = async () => {
      try {
        const { data } = await getCurrentUser();
        const user = data.data;

        if (cancelled) {
          return;
        }

        localStorage.setItem("user", JSON.stringify(user));

        // if (!user.isVerified) {
        //   router.replace("/verify-email");
        //   return;
        // }

        if (user.role !== "client") {
          router.replace(getPostLoginRoute(user));
          return;
        }

        if (user.profileComplete) {
          router.replace(getPostLoginRoute(user));
          return;
        }

        if (user.provider !== "google") {
          router.replace("/register/user");
          return;
        }

        setReady(true);
      } catch {
        router.replace("/login");
      }
    };

    void syncUser();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const update = (field: keyof CompletionForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const fieldErrors = validateSchema(clientGoogleCompletionSchema, form);
    if (fieldErrors) {
      setErrors(fieldErrors as Partial<Record<keyof CompletionForm, string>>);
      return false;
    }

    setErrors({});
    return true;
  };

  const finishRegistration = async (user: AuthUser) => {
    localStorage.setItem("user", JSON.stringify(user));
    router.replace(getPostLoginRoute(user));
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      await completeClientProfile(form);
      const { data } = await getCurrentUser();
      await finishRegistration(data.data);
    } catch (error: unknown) {
      const message = (error as ApiError).response?.data?.message;
      setFailMessage(
        Array.isArray(message)
          ? message[0]
          : message || "حدث خطأ، حاول مرة أخرى",
      );
      setShowFail(true);
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
        <Image src={logoImage} alt="Logo" width={120} className="h-auto" />
      </div>

      <div className="flex items-center justify-center z-10 w-full min-h-screen px-4 py-20 lg:w-[55%] lg:px-12 lg:py-8">
        <div
          className="bg-white rounded-3xl shadow-sm w-full p-7 max-w-sm sm:p-10 sm:max-w-md lg:p-12 lg:max-w-2xl"
          dir="rtl"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-color)] text-center mb-3">
            استكمال البيانات
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm text-center mb-8">
            أكمل البيانات الناقصة لإنهاء إنشاء حسابك والانتقال إلى المنصة.
          </p>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="رقم الهاتف"
                placeholder="+00 0000 000000"
                type="tel"
                icon={Phone}
                value={form.phone}
                onChange={update("phone")}
                error={errors.phone}
                disabled={saving}
              />
              <AuthSelect
                label="النوع"
                placeholder="اختر النوع"
                value={form.gender}
                onChange={update("gender")}
                error={errors.gender}
                disabled={saving}
                options={[
                  { label: "ذكر", value: "male" },
                  { label: "أنثى", value: "female" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthSelect
                label="المحافظة"
                placeholder="اختر محافظتك"
                options={GOVERNORATES}
                value={form.governorate}
                onChange={(value) => {
                  setForm((prev) => ({
                    ...prev,
                    governorate: value,
                    city: "",
                  }));
                  if (errors.governorate || errors.city) {
                    setErrors((prev) => ({
                      ...prev,
                      governorate: "",
                      city: "",
                    }));
                  }
                }}
                error={errors.governorate}
                disabled={saving}
              />
              <AuthInput
                label="المدينة"
                placeholder="اكتب مدينتك"
                value={form.city}
                onChange={update("city")}
                error={errors.city}
                disabled={!form.governorate || saving}
              />
            </div>
          </div>

          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={saving}
            className="mt-6"
          >
            {saving ? "جاري الحفظ..." : "استكمال التسجيل"}
          </Button>
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
              فشل استكمال التسجيل
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
