"use client";

import { useState } from "react";
import {
  X,
  Camera,
  Sparkles,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  validateStep1,
  validateStep2,
} from "@/validators/BookOtherService.validator";
import { suggestTitle, createPost } from "@/api/services/otherService.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
}

const TIME_SLOTS = [
  { label: "8:00 ص", value: "8:00 AM" },
  { label: "9:00 ص", value: "9:00 AM" },
  { label: "10:00 ص", value: "10:00 AM" },
  { label: "11:00 ص", value: "11:00 AM" },
  { label: "12:00 م", value: "12:00 PM" },
  { label: "1:00 م", value: "1:00 PM" },
  { label: "2:00 م", value: "2:00 PM" },
  { label: "3:00 م", value: "3:00 PM" },
  { label: "4:30 م", value: "4:30 PM" },
  { label: "5:00 م", value: "5:00 PM" },
  { label: "6:30 م", value: "6:30 PM" },
  { label: "7:00 م", value: "7:00 PM" },
];

const DAYS = ["سبت", "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"];
const MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

function Calendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: string;
  onSelect: (d: string) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const toKey = (d: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-bold text-[var(--primary-color)]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs text-gray-400 font-medium py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = toKey(day);
          const isToday = key === todayKey;
          const isSelected = selectedDate === key;
          const isPast = key < todayKey;
          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onSelect(key)}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all
                ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                ${isSelected ? "bg-[var(--accent-color)] text-[var(--primary-color)] font-bold" : ""}
                ${isToday && !isSelected ? "border-2 border-[var(--purple-dark)] text-[var(--purple-dark)]" : ""}
                ${!isSelected && !isToday && !isPast ? "hover:bg-gray-100 text-gray-700" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BookOtherServiceModal({
  isOpen,
  onClose,
  categoryId,
  categoryName,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [hasBudget, setHasBudget] = useState(false);
  const [budget, setBudget] = useState("");

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState("");
  const [district, setDistrict] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const resetForm = () => {
    setStep(1);
    setDescription("");
    setTitle("");
    setImage(null);
    setHasBudget(false);
    setBudget("");
    setShowCalendar(false);
    setSelectedDate("");
    setSelectedTime("");
    setDistrict("");
    setFullAddress("");
    setErrors({});
  };

  const handleValidateStep1 = () => {
    const e = validateStep1({ description, title, hasBudget, budget });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleValidateStep2 = () => {
    const e = validateStep2({
      selectedTime,
      selectedDate,
      district,
      fullAddress,
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAiTitle = async () => {
    if (!description || description.length < 10) {
      setErrors({ description: "اكتب وصف المشكلة أولاً (10 أحرف على الأقل)" });
      return;
    }
    setAiLoading(true);
    setErrors({});
    try {
      const t = await suggestTitle(description);
      if (t) {
        setTitle(t);
      } else {
        setErrors({
          title: "لم يتمكن الذكاء الاصطناعي من توليد عنوان، حاول مجدداً",
        });
      }
    } catch (err) {
      console.error("suggestTitle error:", err);
      setErrors({
        title: "فشل توليد العنوان، تأكد من كتابة وصف كافٍ وحاول مجدداً",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!handleValidateStep2()) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await createPost({
        categoryId,
        description,
        title,
        selectedTime,
        selectedDate: selectedDate === "today" ? "today" : "other",
        customDate: selectedDate === "today" ? today : selectedDate,
        district,
        fullAddress,
        hasBudget,
        budget,
        image,
      });
      onClose();
      resetForm();
    } catch (err) {
      console.error("فشل إرسال الطلب", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isCustomDate = selectedDate !== "" && selectedDate !== "today";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      dir="rtl"
    >
      <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden bg-gray-100 shadow-2xl sm:h-[90vh] sm:rounded-[32px]">
        {/* Header */}
        <div className="flex items-start justify-between border-b bg-gray-50 border-gray-200 px-4 sm:px-8 py-6">
          <div className="text-right">
            <h2 className="text-xl font-extrabold text-[var(--primary-color)]">
              طلب خدمة مخصصة
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">
              اكمل البيانات وسنوصلك بالفني المناسب
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="mt-1 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 bg-gray-50">
          <div className="mx-auto max-w-2xl sm:px-12">
            {step === 1 ? (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="mb-1 block text-sm font-bold text-[var(--primary-color)]">
                    القسم المقترح
                  </label>
                  <div className="flex items-center justify-between rounded-xl gap-2 border border-gray-200 bg-[var(--purple-light)] px-4 py-3">
                    <span className="text-sm text-[var(--purple-dark)]">
                      {categoryName}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[var(--purple-dark)]" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-[var(--primary-color)]">
                    وصف المشكلة <span className="text-red-500">*</span>
                  </label>
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="أرغب في تركيب مراية كبيرة في الحمام..."
                      maxLength={500}
                      rows={4}
                      className="w-full resize-none px-4 py-3 text-sm outline-none"
                    />
                    <div className="flex items-center justify-start">
                      <label className="flex cursor-pointer text-[var(--purple-dark)] border border-[var(--purple-dark)] m-3 px-3 py-1 rounded-2xl items-center gap-1.5 text-xs transition-colors hover:text-[var(--purple-dark)]">
                        <Camera
                          size={15}
                          className="text-[var(--purple-dark)]"
                        />
                        ارفق صورة لتوضيح مشكلتك
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            setImage(e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    </div>
                  </div>
                  <span className="mt-1 block text-xs text-gray-400 text-left">
                    {description.length}/500
                  </span>
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.description}
                    </p>
                  )}
                  {image && (
                    <p className="mt-1 text-xs text-green-600">
                      ✓ {image.name}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-1 flex items-center">
                    <label className="text-sm font-bold text-[var(--primary-color)] pe-3">
                      عنوان الخدمة <span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={handleAiTitle}
                      disabled={aiLoading}
                      className="flex items-center gap-1 rounded-full bg-[var(--purple-light)] px-3 py-1 text-xs font-bold text-[var(--purple-dark)] transition-all hover:bg-[var(--purple-dark)] hover:text-white"
                    >
                      <Sparkles size={11} />
                      {aiLoading ? "جارٍ التوليد..." : "مقترح من AI"}
                    </button>
                  </div>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="تركيب مرآة حمام"
                    maxLength={100}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                  />
                  <div className="mt-1 flex items-center justify-between">
                    {errors.title ? (
                      <p className="text-xs text-red-500">{errors.title}</p>
                    ) : title.length >= 5 ? (
                      <p className="text-xs text-[var(--purple-dark)]">
                        ✓ تأكيد العنوان
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-gray-400">
                      {title.length} حرف
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[var(--primary-color)]">
                      تحديد الميزانية (اختياري)
                    </label>
                    <button
                      onClick={() => {
                        setHasBudget((v) => !v);
                        setBudget("");
                      }}
                      className="flex h-6 w-10 rounded-full p-0.5 transition-colors"
                      style={{
                        backgroundColor: hasBudget
                          ? "var(--purple-dark)"
                          : "#E5E7EB",
                        justifyContent: hasBudget ? "flex-end" : "flex-start",
                      }}
                    >
                      <span className="h-5 w-5 rounded-full bg-white shadow" />
                    </button>
                  </div>
                  {hasBudget && (
                    <div className="flex flex-col gap-1">
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="500 جنيه"
                        min={100}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-right text-sm outline-none"
                      />
                      {errors.budget && (
                        <p className="text-xs text-red-500">{errors.budget}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="mb-3 block text-sm font-bold text-[var(--primary-color)]">
                    موعد تنفيذ الخدمة
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSelectedDate("today");
                        setShowCalendar(false);
                      }}
                      className={`rounded-2xl py-3 text-sm font-bold transition-all ${
                        selectedDate === "today"
                          ? "bg-[var(--purple-dark)] text-white"
                          : "bg-[var(--purple-dark)] text-white"
                      }`}
                    >
                      اليوم
                    </button>
                    <button
                      onClick={() => setShowCalendar((v) => !v)}
                      className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all ${
                        isCustomDate || showCalendar
                          ? "bg-[var(--accent-color)] text-[var(--primary-color)]"
                          : "border border-gray-200 text-gray-500"
                      }`}
                    >
                      <CalendarDays size={15} />
                      {isCustomDate ? selectedDate : "تحديد موعد"}
                    </button>
                  </div>
                  {errors.date && (
                    <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                  )}

                  {showCalendar && (
                    <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                      <p className="mb-3 text-right text-xs font-bold text-gray-400">
                        اختر التاريخ
                      </p>
                      <Calendar
                        selectedDate={isCustomDate ? selectedDate : ""}
                        onSelect={(d) => {
                          setSelectedDate(d);
                          setShowCalendar(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold text-[var(--primary-color)]">
                    المواعيد المتاحة
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.value}
                        onClick={() => setSelectedTime(slot.value)}
                        className={`rounded-2xl border py-2.5 text-xs font-bold transition-all ${
                          selectedTime === slot.value
                            ? "border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--primary-color)]"
                            : "border-gray-200 text-gray-500 hover:border-[var(--purple-dark)]"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                  {errors.time && (
                    <p className="mt-1 text-xs text-red-500">{errors.time}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-[var(--primary-color)]">
                      العنوان <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      placeholder="مثال: شارع الملك فهد، البناية 12"
                      className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none"
                    />
                    {errors.fullAddress && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.fullAddress}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-[var(--primary-color)]">
                      المنطقة <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="مثال: حي الزهرة"
                      className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none"
                    />
                    {errors.district && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.district}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-white border-gray-100 px-4 sm:px-8 py-5">
          {step === 1 ? (
            <button
              onClick={() => {
                if (handleValidateStep1()) setStep(2);
              }}
              className="w-full rounded-2xl bg-[var(--purple-dark)] py-4 text-sm font-bold text-white transition-all hover:opacity-90"
            >
              التالي — الموقع و الموعد
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-2xl border border-[var(--purple-dark)] py-4 text-sm font-bold text-[var(--purple-dark)] transition-all hover:bg-[var(--purple-light)]"
              >
                رجوع
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-2xl bg-[var(--purple-dark)] py-4 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "جارٍ الإرسال..." : "إرسال الطلب"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
