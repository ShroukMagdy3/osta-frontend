"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/api/axios";

const EGYPT_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "اسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
  "أسوان",
  "الشرقية",
];

interface Props {
  governorate: string;
  city: string;
  onSaved: (data: { governorate: string; city: string }) => void;
}

export default function LocationSection({ governorate, city, onSaved }: Props) {
  const [govVal, setGovVal] = useState(governorate ?? "");
  const [cityVal, setCityVal] = useState(city ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    setLoading(true);
    try {
      await api.patch("/users/me", {
        governorate: govVal,
        city: cityVal.trim(),
      });
      onSaved({ governorate: govVal, city: cityVal.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      dir="rtl"
    >
      <h2 className="text-lg font-bold text-[var(--primary-color)] mb-5">
        المنطقة
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Governorate — dropdown */}
        <div>
          <label className="text-sm font-bold text-[var(--primary-color)] mb-2 block">
            المحافظة
          </label>
          <div className="relative">
            <select
              value={govVal}
              onChange={(e) => setGovVal(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[var(--primary-color)] outline-none focus:border-[var(--primary-color)] transition-colors cursor-pointer pr-4 pl-10"
              dir="rtl"
            >
              <option value="" disabled>
                اختر المحافظة
              </option>
              {EGYPT_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* City — text input */}
        <div>
          <label className="text-sm font-bold text-[var(--primary-color)] mb-2 block">
            المدينة
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[var(--primary-color)] transition-colors">
            <input
              type="text"
              value={cityVal}
              onChange={(e) => setCityVal(e.target.value)}
              placeholder="أدخل اسم المدينة"
              className="flex-1 bg-transparent text-[var(--primary-color)] text-sm outline-none placeholder:text-gray-300"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mb-3 text-right">{error}</p>}

      <div dir="ltr">
      <button
        onClick={handleSave}
        disabled={loading || saved}
        className=" flex items-center gap-2 bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[var(--accent-hover)] transition-all disabled:opacity-70"
       
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : saved ? (
          <CheckCircle size={15} />
        ) : null}
        {loading ? "جاري الحفظ..." : saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
      </button>
      </div>
    </div>
  );
}
