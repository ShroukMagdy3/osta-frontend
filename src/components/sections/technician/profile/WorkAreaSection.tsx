"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  Search,
} from "lucide-react";
import { api } from "@/api/axios";
import Button from "@/components/ui/Button";
import SaveSuccessModal from "./SaveSuccessModal";
import { EGYPT_GOVERNORATES } from "@/constants/egypt-locations";

interface WorkAreaData {
  governorate: string;
  city: string;
  serviceAreas: string[];
  canWorkOutsideArea: boolean;
}

interface WorkAreaSectionProps extends WorkAreaData {
  onSaved: (data: WorkAreaData) => void;
}

const GOV_OPTIONS = EGYPT_GOVERNORATES.map((g) => ({
  label: g.label,
  value: g.value,
}));

// ─── Searchable Single Select (المحافظة) ────────────────────────────────────────

function GovSingleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filtered = GOV_OPTIONS.filter((o) => o.label.includes(query));
  const selectedLabel = GOV_OPTIONS.find((o) => o.value === value)?.label;

  return (
    <div className="relative" ref={ref} dir="rtl">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm bg-white transition-all cursor-pointer ${
          open
            ? "border-[var(--primary-color)]"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className={selectedLabel ? "text-gray-700" : "text-gray-300"}>
          {selectedLabel ?? "اختر محافظتك"}
        </span>
        {open ? (
          <ChevronUp size={16} className="flex-shrink-0 text-gray-400" />
        ) : (
          <ChevronDown size={16} className="flex-shrink-0 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
            <Search size={14} className="text-gray-300 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن محافظة..."
              className="flex-1 text-sm text-right outline-none placeholder:text-gray-300 bg-transparent"
            />
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-xs text-gray-400">
                لا توجد نتائج
              </p>
            ) : (
              filtered.map((opt) => {
                const selected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-all hover:bg-gray-50 ${
                      selected ? "bg-[var(--secondary-color)]" : ""
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        selected
                          ? "border-[var(--primary-color)] bg-[var(--primary-color)]"
                          : "border-gray-300"
                      }`}
                    >
                      {selected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-[var(--primary-color)]">
                      {opt.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Searchable Multi Select (نطاق العمل) ───────────────────────────────────────

function GovMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (vals: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filtered = GOV_OPTIONS.filter((o) => o.label.includes(query));

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  return (
    <div className="relative" ref={ref} dir="rtl">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm bg-white transition-all cursor-pointer ${
          open
            ? "border-[var(--primary-color)]"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className={selected.length ? "text-gray-700" : "text-gray-300"}>
          {selected.length
            ? `${selected.length} ${selected.length === 1 ? "محافظة" : "محافظات"} محددة`
            : "اختر المحافظات"}
        </span>
        {open ? (
          <ChevronUp size={16} className="flex-shrink-0 text-gray-400" />
        ) : (
          <ChevronDown size={16} className="flex-shrink-0 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
            <Search size={14} className="text-gray-300 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن محافظة..."
              className="flex-1 text-sm text-right outline-none placeholder:text-gray-300 bg-transparent"
            />
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-xs text-gray-400">
                لا توجد نتائج
              </p>
            ) : (
              filtered.map((opt) => {
                const checked = selected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-all hover:bg-gray-50 ${
                      checked ? "bg-[var(--secondary-color)]" : ""
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-all ${
                        checked
                          ? "border-[var(--primary-color)] bg-[var(--primary-color)]"
                          : "border-gray-300"
                      }`}
                    >
                      {checked && (
                        <svg
                          className="h-3 w-3 text-white"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-[var(--primary-color)]">
                      {opt.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Selected pills */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((area) => (
            <span
              key={area}
              className="flex items-center gap-1 rounded-full bg-[var(--secondary-color)] px-3 py-1 text-xs font-medium text-[var(--primary-color)]"
            >
              <button
                type="button"
                onClick={() => onChange(selected.filter((a) => a !== area))}
                className="hover:text-red-500 transition-colors"
              >
                <X size={11} />
              </button>
              {area}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────────────────────────────

export default function WorkAreaSection({
  governorate,
  city,
  serviceAreas,
  canWorkOutsideArea,
  onSaved,
}: WorkAreaSectionProps) {
  const [gov, setGov] = useState(governorate ?? "");
  const [cty, setCty] = useState(city ?? "");
  const [areas, setAreas] = useState<string[]>(serviceAreas ?? []);
  const [outsideArea, setOutsideArea] = useState(canWorkOutsideArea ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync when parent data loads
  useEffect(() => {
    setGov(governorate ?? "");
    setCty(city ?? "");
    setAreas(serviceAreas ?? []);
    setOutsideArea(canWorkOutsideArea ?? false);
  }, [governorate, city, serviceAreas, canWorkOutsideArea]);

  const handleSave = async () => {
    setError("");

    if (!gov) {
      setError("اختر المحافظة");
      return;
    }
    if (!cty.trim()) {
      setError("أدخل المدينة");
      return;
    }
    if (!outsideArea && areas.length === 0) {
      setError("اختر نطاق عمل واحد على الأقل أو فعّل العمل خارج النطاق");
      return;
    }

    setSaving(true);
    try {
      await Promise.all([
        api.patch("/users/me", { governorate: gov, city: cty.trim() }),
        api.post("/technician/step4", {
          serviceAreas: areas,
          canWorkOutsideArea: outsideArea,
        }),
      ]);

      onSaved({
        governorate: gov,
        city: cty.trim(),
        serviceAreas: areas,
        canWorkOutsideArea: outsideArea,
      });
      setShowSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || "حدث خطأ، حاول مرة أخرى");
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
              منطقة العمل
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary-color)]">
                <MapPin size={15} className="text-[var(--primary-color)]" />
              </span>
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              حدد النطاق الجغرافي الذي تقدم فيه خدماتك
            </p>
          </div>
        </div>

        {/* Inner card */}
        <div className="rounded-2xl border border-gray-100 bg-[#FAFAFA] p-5">
          {/* المحافظة + المدينة */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                المحافظة
              </label>
              <GovSingleSelect value={gov} onChange={setGov} />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                المدينة
              </label>
              <input
                type="text"
                value={cty}
                onChange={(e) => setCty(e.target.value)}
                placeholder="اكتب اسم مدينتك"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-right text-sm text-[#112D27] outline-none transition-colors focus:border-[var(--primary-color)] placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* نطاق العمل + العمل خارج النطاق */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                نطاق العمل
              </label>
              <GovMultiSelect selected={areas} onChange={setAreas} />
            </div>

            {/* العمل خارج النطاق toggle */}
            <div
              className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5"
              dir="ltr"
            >
              <button
                type="button"
                dir="ltr"
                onClick={() => setOutsideArea((p) => !p)}
                className={`relative mt-0.5 h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                  outsideArea ? "bg-[var(--accent-color)]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    outsideArea ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>

              <div className="flex-1 text-right">
                <p className="text-sm font-bold text-[#112D27]">
                  العمل خارج النطاق
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  قبول الطلبات خارج نطاق العمل
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-right text-xs text-red-500">{error}</p>
        )}
      </div>

      {showSuccess && (
        <SaveSuccessModal
          message="تم تحديث منطقة العمل بنجاح"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
