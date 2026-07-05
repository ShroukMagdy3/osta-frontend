"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff, Check, X, Lock } from "lucide-react";
import { api } from "@/api/axios";

interface Props {
  email: string;
  passwordChangedAt?: string;
  onPasswordChanged: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCooldownState(passwordChangedAt?: string): {
  isLocked: boolean;
  daysLeft: number;
  unlocksOn: string;
} {
  if (!passwordChangedAt) {
    return { isLocked: false, daysLeft: 0, unlocksOn: "" };
  }

  const changedAt = new Date(passwordChangedAt).getTime();
  const msSince = Date.now() - changedAt;
  const daysSince = msSince / (1000 * 60 * 60 * 24);
  const daysLeft = Math.ceil(30 - daysSince);

  if (daysLeft <= 0) {
    return { isLocked: false, daysLeft: 0, unlocksOn: "" };
  }

  const unlocksOn = new Date(
    changedAt + 30 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return { isLocked: true, daysLeft, unlocksOn };
}

const validatePassword = (pass: string) => ({
  length: pass.length >= 8,
  upper: /[A-Z]/.test(pass),
  lower: /[a-z]/.test(pass),
  number: /[0-9]/.test(pass),
});

// ─── Success Modal ─────────────────────────────────────────────────────────────

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl w-[90%] max-w-sm mx-auto p-8 relative flex flex-col items-center text-center"
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all text-gray-500"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-3 mt-2">
          تم تحديث كلمة المرور!
        </h2>
        <p className="text-sm text-gray-500 mb-10 leading-relaxed">
          تم تغيير كلمة المرور بنجاح. يمكنك تغييرها مرة أخرى بعد 30 يوماً.
        </p>

        <div className="relative flex items-center justify-center mb-10">
          <div className="absolute w-44 h-44 rounded-full bg-[var(--accent-color)]/10" />
          <div className="absolute w-32 h-32 rounded-full bg-[var(--accent-color)]/20" />
          <div className="w-20 h-20 rounded-full bg-[var(--accent-color)] flex items-center justify-center shadow-lg relative z-10">
            <Check
              size={32}
              strokeWidth={3}
              className="text-[var(--primary-color)]"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-base hover:bg-[var(--accent-hover)] transition-all"
        >
          تم
        </button>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function PasswordSection({
  email,
  passwordChangedAt,
  onPasswordChanged,
}: Props) {
  const { isLocked, daysLeft, unlocksOn } = getCooldownState(passwordChangedAt);

  const [open, setOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const validation = validatePassword(newPass);
  const isValid = Object.values(validation).every(Boolean);

  const resetForm = () => {
    setOpen(false);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setError("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleSubmit = async () => {
    setError("");
    if (!currentPass.trim()) {
      setError("أدخل كلمة المرور الحالية");
      return;
    }
    if (!isValid) {
      setError("كلمة المرور الجديدة لا تستوفي المتطلبات");
      return;
    }
    if (newPass !== confirmPass) {
      setError("كلمتا المرور الجديدة غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        currentPassword: currentPass,
        newPassword: newPass,
        confirmPassword: confirmPass,
      });
      setShowModal(true);
      onPasswordChanged();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <SuccessModal
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
        />
      )}

      <div
        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[var(--primary-color)]">
            كلمة المرور
          </h2>
          {open && (
            <button
              onClick={resetForm}
              className="text-sm text-[var(--accent-color)] font-bold hover:underline"
            >
              إلغاء
            </button>
          )}
        </div>

        {/* ── LOCKED state ── */}
        {!open && isLocked && (
          <div className="space-y-3">
            <div className="flex items-center justify-between" dir="ltr">
              {/* Disabled button */}
              <button
                disabled
                className="flex items-center gap-2 text-sm text-gray-400 bg-gray-100 px-4 py-2.5 rounded-xl cursor-not-allowed select-none"
              >
                <Lock size={14} />
                تغيير كلمة المرور
              </button>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                يمكن تغيير كلمة المرور مرة واحدة كل 30 يوماً
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
              </p>
            </div>

            {/* Countdown pill */}
            <div className="flex items-center justify-end">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-4 py-2 rounded-full">
                <Lock size={12} />
                متاح بعد{" "}
                <span className="font-bold text-amber-800">{daysLeft} يوم</span>
                {unlocksOn && (
                  <span className="text-amber-600 mr-1">· {unlocksOn}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── AVAILABLE collapsed state ── */}
        {!open && !isLocked && (
          <div className="flex items-center ">
          
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block m-2" />
            <p className="text-sm text-gray-500 flex items-center gap-2">
              يمكن تغيير كلمة المرور مرة واحدة كل 30 يوماً
            </p>
            <button
              onClick={() => setOpen(true)}
              className="text-sm text-[var(--accent-color)] font-bold hover:underline  mr-auto"
              dir="ltr"
            >
              تغيير كلمة المرور
            </button>
          </div>
        )}

        {/* ── OPEN form ── */}
        {open && (
          <div className="space-y-5">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block flex-shrink-0" />
              يمكن تغيير كلمة المرور مرة واحدة كل 30 يوماً
            </p>

            {/* Current password */}
            <div>
              <label className="text-sm font-bold text-[var(--primary-color)] mb-2 block">
                كلمة المرور الحالية
              </label>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[var(--primary-color)] transition-colors">
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية"
                  className="flex-1 bg-transparent text-[var(--primary-color)] text-sm outline-none placeholder:text-gray-300"
                  dir="rtl"
                />
              </div>
            </div>

            {/* New + confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-[var(--primary-color)] mb-2 block">
                  كلمة المرور الجديدة
                </label>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[var(--primary-color)] transition-colors">
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="8 أحرف على الأقل"
                    className="flex-1 bg-transparent text-[var(--primary-color)] text-sm outline-none placeholder:text-gray-300"
                    dir="rtl"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-[var(--primary-color)] mb-2 block">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[var(--primary-color)] transition-colors">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="8 أحرف على الأقل"
                    className="flex-1 bg-transparent text-[var(--primary-color)] text-sm outline-none placeholder:text-gray-300"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Hint */}
            <div className="bg-[var(--secondary-color)] rounded-xl px-4 py-3 text-sm text-[var(--primary-color)] text-right">
              يجب أن تحتوي كلمة المرور على: 8 أحرف على الأقل، حرف كبير، حرف
              صغير، رقم واحد على الأقل.
            </div>

            {error && (
              <p className="text-sm text-red-500 text-right">{error}</p>
            )}

            {/* Submit — also disabled if somehow locked (double safety) */}
            <button
              onClick={handleSubmit}
              disabled={loading || isLocked}
              className="flex items-center gap-2 bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
