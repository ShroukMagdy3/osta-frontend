"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { validateBookingForm } from "@/validators/bookingForm.validators";
import moneyIcon from "@/assets/icons/money.svg";

interface Props {
  selectedDate: string;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  onSubmit: (locationData: LocationData) => void;
  loading: boolean;

  service: {
    priceRange: {
      min: number | string;
      max: number | string;
    };
  };
}

export interface LocationData {
  district: string;
  fullAddress: string;
  notes: string;
}

const TIME_SLOTS = [
  "8:00 ص",
  "9:00 ص",
  "10:00 ص",
  "11:00 ص",
  "12:00 م",
  "1:00 م",
  "2:00 م",
  "3:00 م",
  "4:00 م",
  "5:00 م",
  "6:00 م",
  "7:00 م",
  "8:00 م",
];

// بيحول الـ slot (زي "8:00 ص" أو "12:00 ص") لساعة 24 ساعة
// "12:00 ص" معناها منتصف الليل (نهاية اليوم) → بنرمزلها بـ 24 عشان نقدر نقارنها صح
function slotToHour24(slot: string): number {
  const [hourPart, period] = slot.split(":")[0]
    ? [Number(slot.split(":")[0]), slot.includes("ص") ? "ص" : "م"]
    : [0, "ص"];

  if (hourPart === 12) {
    return period === "ص" ? 24 : 12; // 12:00 ص = منتصف الليل (نهاية اليوم) | 12:00 م = ظهر
  }
  return period === "م" ? hourPart + 12 : hourPart;
}

// هل اليوم المختار هو النهاردة بالظبط؟
function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const selected = new Date(dateStr);
  const now = new Date();
  return (
    selected.getFullYear() === now.getFullYear() &&
    selected.getMonth() === now.getMonth() &&
    selected.getDate() === now.getDate()
  );
}

export default function BookingForm({
  selectedDate,
  selectedTime,
  onTimeChange,
  onSubmit,
  loading,
  service,
}: Props) {
  const [district, setDistrict] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const todaySelected = isToday(selectedDate);
  const currentHour = new Date().getHours();

  // الـ slot بيتعتبر "فات" بس لو اليوم المختار النهاردة والساعة بتاعته
  // أقل من أو تساوي الساعة الحالية (مش متاح تحجز نفس الساعة الجارية)
  const isSlotPast = (slot: string) => {
    if (!todaySelected) return false;
    const slotHour = slotToHour24(slot);
    return slotHour <= currentHour;
  };

  const displayDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("ar-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const handleSubmit = () => {
    // لو الوقت المختار بقى في الماضي (مثلاً المستخدم سايب الفورم فاتح لفترة)
    if (selectedTime && isSlotPast(selectedTime)) {
      setErrors((prev) => ({
        ...prev,
        selectedTime: "هذا الموعد لم يعد متاحاً، اختر موعداً آخر",
      }));
      onTimeChange("");
      return;
    }

    const fieldErrors = validateBookingForm({
      district,
      fullAddress,
      notes,
      selectedTime,
    });

    if (fieldErrors) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit({ district, fullAddress, notes });
  };

  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div dir="rtl">
      {/* المواعيد المتاحة */}
      <h3 className="font-bold text-[var(--primary-color)] text-right mb-3">
        المواعيد المتاحة
      </h3>
      <div className="grid grid-cols-4 gap-2 mb-1">
        {TIME_SLOTS.map((slot) => {
          const disabled = isSlotPast(slot);
          return (
            <button
              key={slot}
              disabled={disabled}
              onClick={() => {
                onTimeChange(slot);
                clearError("selectedTime");
              }}
              className={`py-2.5 px-3 rounded-full border text-xs font-medium transition-all
                ${
                  disabled
                    ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                    : selectedTime === slot
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--primary-color)]"
                      : "border-gray-200 text-[var(--primary-color)] hover:border-gray-300"
                }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
      {todaySelected && (
        <p className="text-gray-400 text-[11px] text-right mb-1">
          المواعيد التي مرّ وقتها اليوم غير متاحة للحجز
        </p>
      )}
      {todaySelected && TIME_SLOTS.every((slot) => isSlotPast(slot)) ? (
        <p className="text-amber-600 text-xs text-right mb-4 mt-1 bg-amber-50 rounded-full px-4 py-2">
          لا توجد مواعيد متاحة اليوم، يرجى اختيار يوم آخر
        </p>
      ) : errors.selectedTime ? (
        <p className="text-red-500 text-xs text-right mb-4 mt-1">
          {errors.selectedTime}
        </p>
      ) : (
        <div className="mb-6" />
      )}

      {/* نطاق السعر */}
      <h3 className="font-bold text-[var(--primary-color)] text-right mb-3">
        نطاق السعر المتوقع (جنية)
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 text-right">
            الحد الأدنى
          </label>
          <div className="border border-gray-200 rounded-full px-4 py-3 text-center text-sm text-gray-500">
            {service.priceRange.min}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 text-right">
            الحد الأقصى
          </label>
          <div className="border border-gray-200 rounded-full px-4 py-3 text-center text-sm text-gray-500">
            {service.priceRange.max}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* المنطقة */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--primary-color)]">
            المنطقة <span className="text-red-500">*</span>
          </label>
          <input
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              clearError("district");
            }}
            placeholder="مثال: حي الزهرة"
            className={`border rounded-full px-4 py-3 text-sm text-right outline-none placeholder:text-gray-300 transition-all
              ${errors.district ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-[var(--accent-color)]"}`}
          />
          {errors.district && (
            <p className="text-red-500 text-xs text-right">{errors.district}</p>
          )}
        </div>

        {/* العنوان */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--primary-color)]">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            value={fullAddress}
            onChange={(e) => {
              setFullAddress(e.target.value);
              clearError("fullAddress");
            }}
            placeholder="مثال: شارع الملك فهد، البناية 12"
            className={`border rounded-full px-4 py-3 text-sm text-right outline-none placeholder:text-gray-300 transition-all
              ${errors.fullAddress ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-[var(--accent-color)]"}`}
          />
          {errors.fullAddress && (
            <p className="text-red-500 text-xs text-right">
              {errors.fullAddress}
            </p>
          )}
        </div>
      </div>

      {/* الموقع التفصيلي */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-sm font-semibold text-[var(--primary-color)]">
          الموقع التفصيلي
        </label>
        <div className="border border-gray-200 rounded-full px-4 py-3 flex items-center gap-2">
          <MapPin size={16} className="text-gray-300 flex-shrink-0" />
          <input
            placeholder="ارفق الموقع هنا"
            className="flex-1 text-sm text-right outline-none placeholder:text-gray-300 bg-transparent"
          />
        </div>
      </div>

      {/* ملاحظات */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-sm font-semibold text-[var(--primary-color)]">
          ملاحظات إضافية{" "}
          <span className="text-gray-400 font-normal">(اختياري)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="أي تفاصيل إضافية تود إخبار الحرفي بها..."
          rows={3}
          className="border border-gray-200 rounded-2xl px-4 py-3 text-sm text-right outline-none focus:border-[var(--accent-color)] placeholder:text-gray-300 resize-none"
        />
      </div>

      {/* قيمة العربون */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-semibold text-[var(--primary-color)]">
          قيمة العربون <span className="text-gray-400 font-normal">(جنية)</span>
        </label>
        <div className="flex w-full max-w-[13rem] items-center gap-2 rounded-full border border-gray-200 px-4 py-3 sm:px-6">
          <span className="text-sm text-gray-500">
            {"50"}
          </span>
          <Image src={moneyIcon} alt="money" width={16} height={16} />
        </div>
      </div>

      {/* ملخص الموعد + زرار الإرسال */}
      <div className="bg-[var(--secondary-color)] rounded-2xl p-4 flex items-center justify-between">
        <div className="text-right">
          <p className="font-bold text-[var(--primary-color)] text-sm">
            {displayDate}
          </p>
          <p className="text-gray-400 text-xs">الساعة {selectedTime}</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-8 py-3 rounded-full font-bold text-sm transition-all
            ${
              !loading
                ? "bg-[var(--accent-color)] text-[var(--primary-color)] hover:opacity-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          {loading ? "جاري الإرسال..." : "إرسال الطلب"}
        </button>
      </div>
    </div>
  );
}