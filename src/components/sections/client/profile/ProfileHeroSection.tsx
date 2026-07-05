"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/client/Navbar";
import { api } from "@/api/axios";

interface Props {
  fullName: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  onNameUpdated: (newName: string) => void;
}

export default function ProfileHeroSection({
  fullName,
  email,
  isVerified,
  createdAt,
  onNameUpdated,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [nameVal, setNameVal] = useState(fullName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep local value in sync if parent re-fetches
  useEffect(() => {
    if (!editing) setNameVal(fullName);
  }, [fullName, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");

  const memberSince = new Date(createdAt).toLocaleDateString("ar-EG", {
    month: "long",
    year: "numeric",
  });

  const handleSave = async () => {
    const trimmed = nameVal.trim();
    if (!trimmed || trimmed.length < 3) {
      setError("الاسم يجب أن يكون 3 أحرف على الأقل");
      return;
    }
    if (trimmed === fullName) {
      setEditing(false);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await api.patch("/users/me", { fullName: trimmed });
      onNameUpdated(trimmed);
      setEditing(false);
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNameVal(fullName);
    setError("");
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <section className="primary-gradient w-full" dir="rtl">
      <div className="lg:p-5">
        <Navbar />
      </div>

      <div className="px-8 md:px-16 lg:px-24 pt-4 pb-12">
        <div className="flex items-center justify-end gap-6" dir="ltr">
          {/* Text info */}
          <div className="text-right" dir="ltr">
            {/* Name row */}
            <div className="flex items-center justify-end gap-2 mb-1" dir="ltr">
              {editing ? (
                <>
                  {/* Confirm / Cancel buttons */}
                  {loading ? (
                    <Loader2 size={16} className="text-white animate-spin" />
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                      >
                        <X size={13} className="text-white" />
                      </button>
                      <button
                        onClick={handleSave}
                        className="w-7 h-7 rounded-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] flex items-center justify-center transition-all"
                      >
                        <Check
                          size={13}
                          className="text-[var(--primary-color)]"
                        />
                      </button>
                    </>
                  )}

                  {/* Editable input */}
                  <input
                    ref={inputRef}
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full max-w-[16rem] border-b-2 border-white/60 bg-transparent text-right text-3xl font-bold text-white outline-none transition-colors placeholder:text-white/40 focus:border-[var(--accent-color)] md:max-w-[20rem] md:text-4xl"
                    dir="rtl"
                    maxLength={60}
                  />
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <Pencil size={14} className="text-white" />
                  </button>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {fullName}
                  </h1>
                </>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-xs mb-1 text-right">{error}</p>
            )}

            <p className="text-white/70 text-sm mb-2">{email}</p>

            <div className="flex items-center justify-end gap-3 text-sm">
              {isVerified && (
                <span className="text-[var(--accent-color)] flex items-center gap-1 font-medium">
                  ✓ عميل موثق
                </span>
              )}
              <span className="text-white/40">•</span>
              <span className="text-white/60">عضو منذ {memberSince}</span>
            </div>
          </div>

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[var(--accent-color)] flex items-center justify-center flex-shrink-0">
            <span className="text-[var(--primary-color)] text-2xl font-bold">
              {initials}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
