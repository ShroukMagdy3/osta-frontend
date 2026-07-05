"use client";

import { useState } from "react";
import { Phone, Mail, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/api/axios";

interface Props {
  email: string;
  phone: string;
  onSaved: (newPhone: string) => void;
}

export default function ContactInfoSection({ email, phone, onSaved }: Props) {
  const [phoneVal, setPhoneVal] = useState(phone);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!phoneVal.trim()) {
      setError("رقم الهاتف مطلوب");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.patch("/users/me", { phone: phoneVal.trim() });
      onSaved(phoneVal.trim());
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
        بيانات التواصل
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Email — read only */}
        <div>
          <label className="text-sm text-gray-500 mb-2 block">
            البريد الإلكتروني
          </label>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <Mail size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-[var(--primary-color)] text-sm font-medium flex-1 text-left ltr">
              {email}
            </span>
          </div>
        </div>

        {/* Phone — editable */}
        <div>
          <label className="text-sm text-gray-500 mb-2 block">رقم الهاتف</label>
          <div
            className={`flex items-center gap-2 bg-white border rounded-xl px-4 py-3 transition-colors ${
              error
                ? "border-red-300"
                : "border-gray-200 focus-within:border-[var(--primary-color)]"
            }`}
          >
            <Phone size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="tel"
              value={phoneVal}
              onChange={(e) => setPhoneVal(e.target.value)}
              className="flex-1 bg-transparent text-[var(--primary-color)] text-sm font-medium outline-none text-left ltr placeholder:text-gray-300"
              placeholder="+20XXXXXXXXXX"
              dir="ltr"
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>

      <div dir="ltr">
      <button
        onClick={handleSave}
        disabled={loading || saved}
        className="flex items-center gap-2 bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[var(--accent-hover)] transition-all disabled:opacity-70"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : saved ? (
          <CheckCircle size={16} />
        ) : null}
        {loading ? "جاري الحفظ..." : saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
      </button>
      </div>
    </div>
  );
}
