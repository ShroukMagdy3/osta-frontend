/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { X ,Clock, Star, CalendarDays } from "lucide-react";
import DatePicker from "./DatePicker";
import BookingForm, { LocationData } from "./BookingForm";
import BookingSuccess from "./BookingSuccess";
import { createBooking } from "@/api/services/booking.service";

export interface Service {
  _id: string;
  key: string;
  name: string;
  description: string;
  image: string;

  category: {
    _id: string;
    key: string;
    name: string;
    image: string;
  };

  priceRange: {
    min: number;
    max: number;
  };

  averageRating: number;
  totalRatings: number;
}

interface Props {
  service: Service;
  onClose: () => void;
}

const parseArabicTime = (timeStr: string): string => {
  const isAM = timeStr.includes("ص");
  const timePart = timeStr.replace("ص", "").replace("م", "").trim();
  const [hours] = timePart.split(":");
  let h = parseInt(hours);
  if (!isAM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:00`;
};

export default function BookingModal({ service, onClose }: Props) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [dateMode, setDateMode] = useState<"today" | "pick">("today");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleTodayClick = () => {
    setDateMode("today");
    setSelectedDate(todayStr);
  };

  const handlePickClick = () => {
    setDateMode("pick");
  };

  const handleSubmit = async (locationData: LocationData) => {
    setLoading(true);
    try {
      await createBooking({
        categoryId: service.category._id,
        serviceId: service._id,
        address: {
          fullAddress: locationData.fullAddress,
          district: locationData.district,
          coordinates: { lat: 30.0444, lng: 31.2357 },
        },
        preferredDate: selectedDate,
        preferredTime: parseArabicTime(selectedTime),
        notes: locationData.notes,
      });
      setDone(true);
    } catch (err: any) {
      console.error("Booking error details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="mx-0 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <BookingSuccess onClose={onClose} />
        ) : (
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-3">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <X size={16} className="text-gray-400" />
              </button>
              <div className="text-right">
                <h2 className="text-xl font-bold text-[var(--primary-color)] sm:text-2xl">
                  تحديد موعد لحجز
                </h2>
                <p className="text-gray-400 text-sm">{service.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              {/* كارت الخدمة — ثابت */}
              <div className="w-full" dir="rtl">
                <h3 className="font-bold text-[var(--primary-color)] mb-3 text-right">
                  الخدمة المطلوبة
                </h3>
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="relative w-full h-44">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[var(--primary-color)]">
                      {service.category.name}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-sm text-[var(--primary-color)]">
                        {service.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-xs text-gray-500">
                          {service.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#545454] leading-relaxed text-right line-clamp-2 mb-2">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-1 bg-[var(--secondary-color)] px-2 py-1 w-fit rounded-xl">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-400">
                        30 - 45 دقيقة
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* الفورم — ثابت الزرارين، متغير المحتوى */}
              <div className="w-full" dir="rtl">
                <h3 className="font-bold text-[var(--primary-color)] text-right mb-3">
                  موعد تنفيذ الخدمة
                </h3>

                {/* الزرارين — ثابتين دايماً */}
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={handleTodayClick}
                    className={`py-3 px-4 rounded-2xl border-2 text-sm transition-all
                      ${
                        dateMode === "today"
                          ? "border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--primary-color)] font-bold"
                          : "border-[var(--primary-color)] text-[var(--primary-color)]"
                      }`}
                  >
                    اليوم
                  </button>
                  <button
                    onClick={handlePickClick}
                    className={`py-3 px-4 rounded-2xl border-2 text-sm flex items-center justify-center gap-2 transition-all
                      ${
                        dateMode === "pick"
                          ? "border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--primary-color)] font-bold"
                          : "border-[var(--primary-color)] text-[var(--primary-color)]"
                      }`}
                  >
                    تحديد موعد
                    <CalendarDays size={15} />
                  </button>
                </div>

                {/* الكاليندر — بيظهر بس لما pick */}
                {dateMode === "pick" && (
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                )}

                {/* فورم المواعيد والعنوان — ثابت في الحالتين */}
                <BookingForm
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onTimeChange={setSelectedTime}
                  onSubmit={handleSubmit}
                  loading={loading}
                  service={service}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}