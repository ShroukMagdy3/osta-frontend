"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import authBg from "@/assets/images/auth-bg.jpg";
import Button from "@/components/ui/Button";
import { api } from "@/api/axios";
import logoImage from "@/assets/images/logo.svg";

const STEPS = [
  "المعلومات الأساسية",
  "التخصصات والخدمات",
  "منطقة العمل",
  "التحقق من الهوية",
  "مراجعة الطلب",
];
const currentStep = 1;

interface Service {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  services?: Service[];
}

interface SelectedCategory {
  categoryId: string;
  serviceIds: string[];
}

export default function SpecializationsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<SelectedCategory | null>(null); // واحدة بس
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        const withServices = await Promise.all(
          data.data.map(async (cat: Category) => {
            const res = await api.get(`/services?categoryId=${cat._id}`);
            return { ...cat, services: res.data.data };
          }),
        );
        setCategories(withServices);
        console.log(data.data);
      } catch {
        setError("حدث خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // اختيار كاتيجوري — radio (واحدة بس)
  const selectCategory = (categoryId: string) => {
    if (selected?.categoryId === categoryId) {
      // إلغاء الاختيار
      setSelected(null);
      setOpenDropdown(false);
    } else {
      setSelected({ categoryId, serviceIds: [] });
      setOpenDropdown(true);
    }
    if (error) setError("");
  };

  // toggle خدمة — checkbox (أكتر من واحدة)
  const toggleService = (serviceId: string) => {
    if (!selected) return;
    setSelected((prev) => {
      if (!prev) return prev;
      const exists = prev.serviceIds.includes(serviceId);
      return {
        ...prev,
        serviceIds: exists
          ? prev.serviceIds.filter((id) => id !== serviceId)
          : [...prev.serviceIds, serviceId],
      };
    });
  };

  const isServiceSelected = (serviceId: string) =>
    selected?.serviceIds.includes(serviceId) ?? false;

  const validate = () => {
    if (!selected) {
      setError("اختر تخصصاً واحداً على الأقل");
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validate()) return;
    try {
      await api.post("/technician/step2", {
        categoryId: selected?.categoryId,
        serviceIds: selected?.serviceIds || [],
      });
      router.push("/register/technician/experienceAndTools");
    } catch (error: any) {
      const message = error.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message[0]
          : message || "حدث خطأ، حاول مرة أخرى",
      );
    }
  };

  const selectedCat = categories.find((c) => c._id === selected?.categoryId);

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
            اختر المجالات والخدمات التي يمكنك تقديمها.
          </p>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* الكاتيجوريز — grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => selectCategory(cat._id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all
                      ${
                        selected?.categoryId === cat._id
                          ? "border-[var(--primary-color)] bg-[var(--secondary-color)]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${
                        selected?.categoryId === cat._id
                          ? "bg-[var(--primary-color)] border-[var(--primary-color)]"
                          : "border-gray-300"
                      }`}
                    >
                      {selected?.categoryId === cat._id && (
                        <Check
                          size={12}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-[var(--primary-color)]">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* الخدمات — بيظهر بس لو في كاتيجوري متاختارة */}
              {selected && selectedCat && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* header */}
                  <button
                    onClick={() => setOpenDropdown((prev) => !prev)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-all"
                  >
                    <span className="text-gray-400">
                      {openDropdown ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                    <span className="text-sm text-gray-400">
                      اختر التخصصات الفرعية
                    </span>
                  </button>

                  {/* قايمة الخدمات */}
                  {openDropdown && (
                    <div
                      className="border-t border-gray-100"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "var(--primary-color) transparent",
                      }}
                    >
                      <div
                        className="max-h-48 overflow-y-auto"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "var(--primary-color) transparent",
                        }}
                      >
                        {selectedCat.services?.map((srv) => (
                          <button
                            key={srv._id}
                            onClick={() => toggleService(srv._id)}
                            className={`w-full flex items-center justify-between px-4 py-3 transition-all hover:bg-gray-50
                              ${isServiceSelected(srv._id) ? "bg-[var(--secondary-color)]" : "bg-white"}`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                              ${
                                isServiceSelected(srv._id)
                                  ? "bg-[var(--primary-color)] border-[var(--primary-color)]"
                                  : "border-gray-300"
                              }`}
                            >
                              {isServiceSelected(srv._id) && (
                                <Check
                                  size={10}
                                  className="text-white"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                            <span className="text-sm text-[var(--primary-color)]">
                              {srv.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
