"use client";

import { useEffect, useState } from "react";
import { Wrench, Loader2 } from "lucide-react";
import { api } from "@/api/axios";
import Button from "@/components/ui/Button";
import AuthSelect from "@/components/auth/AuthSelect";
import SaveSuccessModal from "./SaveSuccessModal";

const DAYS_OPTIONS = [
  { label: "السبت", value: "السبت" },
  { label: "الأحد", value: "الأحد" },
  { label: "الاثنين", value: "الاثنين" },
  { label: "الثلاثاء", value: "الثلاثاء" },
  { label: "الأربعاء", value: "الأربعاء" },
  { label: "الخميس", value: "الخميس" },
  { label: "الجمعة", value: "الجمعة" },
];

const HOURS_OPTIONS = [
  { label: "12 ص", value: "12 AM" },
  { label: "1 ص", value: "1 AM" },
  { label: "2 ص", value: "2 AM" },
  { label: "3 ص", value: "3 AM" },
  { label: "4 ص", value: "4 AM" },
  { label: "5 ص", value: "5 AM" },
  { label: "6 ص", value: "6 AM" },
  { label: "7 ص", value: "7 AM" },
  { label: "8 ص", value: "8 AM" },
  { label: "9 ص", value: "9 AM" },
  { label: "10 ص", value: "10 AM" },
  { label: "11 ص", value: "11 AM" },
  { label: "12 م", value: "12 PM" },
  { label: "1 م", value: "1 PM" },
  { label: "2 م", value: "2 PM" },
  { label: "3 م", value: "3 PM" },
  { label: "4 م", value: "4 PM" },
  { label: "5 م", value: "5 PM" },
  { label: "6 م", value: "6 PM" },
  { label: "7 م", value: "7 PM" },
  { label: "8 م", value: "8 PM" },
  { label: "9 م", value: "9 PM" },
  { label: "10 م", value: "10 PM" },
  { label: "11 م", value: "11 PM" },
];

interface ExperienceToolsData {
  yearsOfExperience: number;
  hasTools: boolean;
  hasTransportation: boolean;
  workingDays: string[];
  startTime: string;
  endTime: string;
}

interface ExperienceToolsSectionProps extends ExperienceToolsData {
  onSaved: (data: ExperienceToolsData) => void;
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 px-4 py-3.5">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        dir="ltr"
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
          checked ? "bg-[var(--accent-color)]" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <div className="text-right">
        <p className="text-sm font-bold text-[#112D27]">{label}</p>
        <p className="mt-0.5 text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export default function ExperienceToolsSection({
  yearsOfExperience,
  hasTools,
  hasTransportation,
  workingDays,
  startTime,
  endTime,
  onSaved,
}: ExperienceToolsSectionProps) {
  const [years, setYears] = useState(String(yearsOfExperience ?? ""));
  const [tools, setTools] = useState(hasTools);
  const [transport, setTransport] = useState(hasTransportation);
  const [selectedDays, setSelectedDays] = useState<string[]>(workingDays ?? []);
  const [fromHour, setFromHour] = useState(startTime ?? "");
  const [toHour, setToHour] = useState(endTime ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setYears(String(yearsOfExperience ?? ""));
    setTools(hasTools);
    setTransport(hasTransportation);
    setSelectedDays(workingDays ?? []);
    setFromHour(startTime ?? "");
    setToHour(endTime ?? "");
  }, [
    yearsOfExperience,
    hasTools,
    hasTransportation,
    workingDays,
    startTime,
    endTime,
  ]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSave = async () => {
    setError("");

    const yearsNum = Number(years);
    if (!years || Number.isNaN(yearsNum) || yearsNum < 0) {
      setError("أدخل عدد سنوات خبرة صحيح");
      return;
    }
    if (selectedDays.length === 0) {
      setError("اختر يوم عمل واحد على الأقل");
      return;
    }
    if (!fromHour || !toHour) {
      setError("اختر أوقات العمل");
      return;
    }

    setSaving(true);
    try {
      await api.post("/technician/step3", {
        yearsOfExperience: yearsNum,
        hasTools: tools,
        hasTransportation: transport,
        workingDays: selectedDays,
        startTime: fromHour,
        endTime: toHour,
      });

      onSaved({
        yearsOfExperience: yearsNum,
        hasTools: tools,
        hasTransportation: transport,
        workingDays: selectedDays,
        startTime: fromHour,
        endTime: toHour,
      });
      setShowSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message[0]
          : message || "حدث خطأ، حاول مرة أخرى",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        dir="rtl"
        className="rounded-[24px] border border-[#EAECE8] bg-white p-6 shadow-sm"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-3" dir="ltr">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-shrink-0 !px-6 !py-2.5 !text-sm"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                جاري الحفظ...
              </span>
            ) : (
              "حفظ التغييرات"
            )}
          </Button>

          <div className="text-right">
            <h2 className="flex items-center justify-end gap-2 text-base font-bold text-[#112D27]">
              الخبرة و الأدوات
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary-color)]">
                <Wrench size={15} className="text-[var(--primary-color)]" />
              </span>
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              معلومات تساعد العملاء على معرفة جاهزيتك للعمل
            </p>
          </div>
        </div>

        {/* Toggles + years */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto]" dir="ltr">
          <ToggleRow
            label="الأدوات اللازمة"
            description="يمتلك معدات العمل الكاملة"
            checked={tools}
            onChange={setTools}
          />
          <ToggleRow
            label="وسيلة مواصلات"
            description="يمتلك وسيلة نقل خاصة"
            checked={transport}
            onChange={setTransport}
          />

          <div className="sm:w-36">
            <label className="mb-2 block text-sm text-gray-400" dir="rtl">
              سنوات الخبرة
            </label>
            <input
              type="number"
              min={0}
              max={60}
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium text-[#112D27] outline-none transition-colors focus:border-[var(--primary-color)]"
            />
          </div>
        </div>

        {/* أيام العمل */}
        <div className="mt-6">
          <label className="mb-2 block text-sm text-gray-400">أيام العمل</label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OPTIONS.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`rounded-xl border-2 px-4 py-2 text-xs font-medium transition-all ${
                  selectedDays.includes(day.value)
                    ? "border-[var(--primary-color)] bg-[var(--secondary-color)] text-[var(--primary-color)]"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* أوقات العمل */}
        <div className="mt-6">
          <label className="mb-2 block text-sm text-gray-400">
            أوقات العمل
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthSelect
              label=""
              placeholder="من الساعة"
              options={HOURS_OPTIONS}
              value={fromHour}
              onChange={setFromHour}
            />
            <AuthSelect
              label=""
              placeholder="إلى الساعة"
              options={HOURS_OPTIONS}
              value={toHour}
              onChange={setToHour}
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-right text-xs text-red-500">{error}</p>
        )}
      </div>

      {showSuccess && (
        <SaveSuccessModal
          message="تم تحديث بيانات الخبرة والأدوات بنجاح"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
