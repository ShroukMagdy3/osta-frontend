"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface AuthSelectProps {
  label: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function AuthSelect({
  label,
  placeholder = "اختر...",
  options,
  value,
  onChange,
  error,
  disabled = false,
}: AuthSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // إغلاق لو ضغط برا
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="flex flex-col gap-1.5" dir="rtl" ref={ref}>
      <label className="text-sm font-medium text-[var(--primary-color)] text-right">
        {label}
      </label>

      {/* trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`
          flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all bg-white text-sm
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"}
          ${error ? "border-red-400" : open ? "border-[var(--accent-color)]" : "border-gray-200 hover:border-gray-300"}
        `}
      >
        <span className={selectedLabel ? "text-gray-700" : "text-gray-300"}>
          {selectedLabel || placeholder}
        </span>
        {open ? (
          <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        )}
      </button>

      {/* dropdown */}
      {open && (
        <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`
            w-full flex items-center justify-between px-4 py-3 text-sm transition-all hover:bg-gray-50
            ${value === option.value ? "bg-[var(--secondary-color)]" : ""}
          `}
              >
                <div
                  className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${
              value === option.value
                ? "border-[var(--primary-color)] bg-[var(--primary-color)]"
                : "border-gray-300"
            }
          `}
                >
                  {value === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-[var(--primary-color)]">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <span className="min-h-[1.25rem] text-xs text-red-500 text-right leading-5" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}
