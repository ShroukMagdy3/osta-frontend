"use client";

import { useState } from "react";
import { X, Check, Smartphone, Wallet, Landmark, ChevronDown, DollarSign, Banknote } from "lucide-react";
import { isWithdrawalFormValid, validateWithdrawalForm, WithdrawalFormErrors, WithdrawalMethod } from "@/validators/withdraw.validators";
import { requestWithdrawal } from "@/api/services/wallet.service";


const METHODS: {
  value: WithdrawalMethod;
  label: string;
  icon: typeof Smartphone;
  accountLabel: string;
  placeholder: string;
  inputMode: "tel" | "numeric";
  maxLength: number;
}[] = [
  {
    value: WithdrawalMethod.VODAFONE_CASH,
    label: "فودافون كاش",
    icon: Smartphone,
    accountLabel: "رقم فودافون كاش",
    placeholder: "01xxxxxxxxx",
    inputMode: "tel",
    maxLength: 11,
  },
  {
    value: WithdrawalMethod.INSTAPAY,
    label: "إنستاباي",
    icon: Wallet,
    accountLabel: "رقم الموبايل المسجل على إنستاباي",
    placeholder: "01xxxxxxxxx",
    inputMode: "tel",
    maxLength: 11,
  },
  {
    value: WithdrawalMethod.VISA,
    label: "فيزا (حساب بنكي)",
    icon: Landmark,
    accountLabel: "رقم الحساب البنكي",
    placeholder: "xxxxxxxxxxxx",
    inputMode: "numeric",
    maxLength: 20,
  },
];

interface WithdrawalModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  maxAmount?: number; 
  technicianName?: string; 
}

export default function WithdrawalModal({ onClose, onSuccess, maxAmount, technicianName }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<WithdrawalMethod | "">("");
  const [accountNumber, setAccountNumber] = useState("");
  const [errors, setErrors] = useState<WithdrawalFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedMethod = METHODS.find((m) => m.value === method);

  const handleSubmit = async () => {
    setServerError("");

    const newErrors = validateWithdrawalForm({ amount, method, accountNumber }, maxAmount);
    setErrors(newErrors);
    if (!isWithdrawalFormValid(newErrors)) return;

    setSubmitting(true);
    try {
      await requestWithdrawal({
        amount: Number(amount),
        method: method as WithdrawalMethod,
        accountNumber: accountNumber.trim(),
      });

      setSubmitted(true);
    } catch (err: any) {
      setServerError(err.message || "حدث خطأ أثناء إرسال طلب السحب، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:px-4">
  <div dir="rtl"
    className="flex w-full sm:max-w-2xl flex-col overflow-hidden bg-gray-50 shadow-2xl sm:h-auto sm:rounded-[32px]"
  >
    {submitted ? (
      <div className="flex flex-col items-center px-6 pb-10 pt-12 text-center">
        <button
          onClick={onClose}
          className="absolute left-6 top-6 text-gray-400 transition hover:text-gray-600"
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-extrabold" style={{ color: "var(--primary-color)" }}>
          تم إرسال طلب السحب!
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
          تم استلام طلبك وسيتم مراجعته. ستصلك إشعار فور الموافقة أو الرفض خلال 48 ساعة عمل.
        </p>

        <div
          className="my-8 flex h-24 w-24 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--purple-light)" }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: "var(--purple-dark)" }}
          >
            <Check className="h-8 w-8 stroke-[3]" />
          </div>
        </div>

        <button
          onClick={() => {
            onSuccess?.();
            onClose();
          }}
          className="w-full rounded-full py-3 text-sm font-extrabold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--purple-dark)" }}
        >
          تمام
        </button>
      </div>
    ) : (
      <>
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-4 sm:px-8 py-6">
          <button
            onClick={onClose}
            className="absolute left-4 sm:left-8 top-6 text-gray-400 transition hover:text-gray-600"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>

          <div>
            <h2 className="text-lg font-extrabold" style={{ color: "var(--primary-color)" }}>
              طلب سحب رصيد
            </h2>
            {technicianName && <p className="mt-0.5 text-sm text-gray-400">{technicianName}</p>}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm text-gray-500">المبلغ</label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 bg-white">
                  <input
                    type="number"
                    min={50}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white text-sm outline-none text-right"
                  />
                  <Banknote className="h-3.5 w-3.5"  style={{ color: "var(--primary-color)" }} />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  {errors.amount ? (
                    <p className="text-red-500 text-xs">{errors.amount}</p>
                  ) : (
                    <span className="text-xs text-gray-400">الحد الأدنى EGP 50</span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-500">طريقة السحب</label>
                <div className="relative">
                  <select
                    value={method}
                    onChange={(e) => {
                      setMethod(e.target.value as WithdrawalMethod);
                      setAccountNumber("");
                    }}
                    className="w-full appearance-none rounded-2xl border border-gray-200 bg-white py-2.5 pr-10 pl-10 text-sm outline-none text-right"
                  >
                    <option value="" disabled>
                      اختر طريقة السحب
                    </option>
                    {METHODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <span
                    className="pointer-events-none absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full"
                  >
                    <Wallet className="h-3.5 w-3.5" style={{ color: "var(--primary-color)" }} />
                  </span>
                </div>
                {errors.method && <p className="text-red-500 text-xs mt-1">{errors.method}</p>}
              </div>

              {selectedMethod && (
                <div>
                  <label className="mb-1.5 block text-sm text-gray-500">{selectedMethod.accountLabel}</label>
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 bg-white">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    >
                      <selectedMethod.icon className="h-3.5 w-3.5" style={{ color: "var(--primary-color)" }} />
                    </span>
                    <input
                      type="text"
                      inputMode={selectedMethod.inputMode}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder={selectedMethod.placeholder}
                      maxLength={selectedMethod.maxLength}
                      className="w-full bg-transparent text-sm outline-none text-right"
                    />
                  </div>
                  {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
                </div>
              )}

              {serverError && <p className="text-center text-sm text-red-500">{serverError}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 sm:p-6">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-full py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--accent-hover)" }}
          >
            {submitting ? "جارٍ الإرسال..." : "تم"}
          </button>
        </div>
      </>
    )}
  </div>
</div>
  );
}