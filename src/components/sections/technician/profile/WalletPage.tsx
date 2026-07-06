"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import WithdrawalModal from "@/components/sections/technician/wallet/walletModal";
import { getWallet, WalletData } from "@/api/services/wallet.service";

interface StoredUser {
  email: string;
  fullName: string;
  id: string;
  isVerified: boolean;
  profileComplete: boolean;
  provider: string;
  role: string;
  technicianData?: {
    currentStep: number;
    isProfileComplete: boolean;
    verificationStatus: string;
  };
}

const STATUS_LABELS: Record<string, string> = {
  completed: "مكتملة",
  pending: "قيد المراجعة",
  rejected: "مرفوضة",
};

const DESCRIPTION_LABELS: Record<string, string> = {
  payment: "دفع من العميل",
  withdrawal: "طلب سحب",
  refund: "استرجاع مبلغ",
  bonus: "مكافأة",
  credit: "دفع من العميل",
  debit: "طلب سحب",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTransactionDescription(
  tx: WalletData["transactions"][number]
) {
  if (DESCRIPTION_LABELS[tx.description]) {
    return DESCRIPTION_LABELS[tx.description];
  }
  // Fallback: لو الوصف مش موجود في الـ mapping، بنعرض نص عربي
  // بناءً على نوع العملية بدل النص الخام الجاي من السيرفر
  return tx.type === "credit" ? "دفع من العميل" : "طلب سحب";
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [technicianName, setTechnicianName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const fetchWallet = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getWallet();
      setWallet(data);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل المحفظة، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();

    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const parsed: StoredUser = JSON.parse(rawUser);
        setTechnicianName(parsed.fullName || "");
      }
    } catch {}
  }, []);

  return (
    <div
      dir="rtl"
      className="max-w-3xl mx-auto rounded-3xl shadow-xl border border-gray-200"
    >
      {/* Header */}
      <div className="bg-[#F8F9F7] px-3 py-4 rounded-t-3xl ">
        <div className="flex items-center justify-between  px-6 py-5">
          <div className=" flex  ">
            <span className="flex h-10 w-10 me-2 items-center justify-center rounded-full bg-[#DEEEE1]">
              <Wallet size={14} style={{ color: "var(--primary-color)" }} />
            </span>
            <div>
              <h3
                className="flex items-center gap-2 text-lg font-extrabold"
                style={{ color: "var(--primary-color)" }}
              >
                المحفظة
              </h3>
              <p
                className="text-xs mt-0.5 "
                style={{ color: "var(--gray-color)" }}
              >
                تابع رصيدك و اطلب السحب في أي وقت
              </p>
            </div>
          </div>
          <button
            onClick={fetchWallet}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-50"
            style={{
              backgroundColor: "var(--secondary-color)",
              color: "var(--primary-color)",
            }}
            aria-label="تحديث"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="rounded-b-3xl border border-t-0 border-gray-100 bg-white p-6 pt-0">
        {/* Balance card */}
        <div className="pt-6">
          {error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-sm text-red-500">
              {error}
            </div>
          ) : (
            <div className="primary-gradient relative overflow-hidden rounded-[28px] p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                    <Wallet className="h-4 w-4 text-white/70" />
                    <span className="text-xs font-bold text-white/70">
                      الرصيد الحالي
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    {loading ? (
                      <span className="text-4xl font-extrabold text-white">
                        ...
                      </span>
                    ) : (
                      <span className="text-4xl font-extrabold text-white">
                        {(wallet?.balance ?? 0).toLocaleString("en-US")}
                      </span>
                    )}
                    <span className="text-sm text-white/70">EGP</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={loading || !!error}
                  className="shrink-0 self-end rounded-full px-5 py-2.5  text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    color: "var(--primary-color)",
                  }}
                >
                  طلب سحب
                </button>
              </div>

              <p className="mt-4 text-[11px] leading-5 text-white/60">
                هذا هو الرصيد المتاح للسحب حاليًا من حسابك
              </p>
            </div>
          )}
        </div>

        {/* Info banner */}
        <div
          className="mt-6 flex items-center  bg-[#F8F9F7] gap-3 rounded-2xl border border-dashed px-4 py-3"
          style={{ borderColor: "#E5E7EB" }}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "#E8F8BA" }}
          >
            <Bell size={14} style={{ color: "var(--primary-color)" }} />
          </span>
          <p
            className="text-xs leading-5"
            style={{ color: "var(--gray-color)" }}
          >
            ستظهر إشعارات داخل التطبيق فور الموافقة على طلب السحب أو رفضه، خلال
            مدة لا تتجاوز 48 ساعة عمل
          </p>
        </div>

        {/* Transactions card */}
        {!error && wallet && wallet.transactions.length > 0 && (
          <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4
              className="mb-4 text-sm font-bold"
              style={{ color: "var(--gray-color)" }}
            >
              آخر العمليات
            </h4>
            <div className="flex flex-col gap-3">
              {wallet.transactions
                .slice()
                .reverse()
                .map((tx) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor:
                            tx.type === "credit"
                              ? "var(--primary-color)"
                              : "#FEE2E2",
                        }}
                      >
                        {tx.type === "credit" ? (
                          <ArrowDownLeft className="h-4 w-4 text-white" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-gray-800 line-clamp-1 max-w-[220px]">
                          {getTransactionDescription(tx)}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-400">
                          {formatDate(tx.createdAt)} ·{" "}
                          {STATUS_LABELS[tx.status] ?? tx.status}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-base font-extrabold shrink-0"
                      style={{
                        color:
                          tx.type === "credit"
                            ? "var(--primary-color)"
                            : "#EF4444",
                      }}
                    >
                      {tx.amount.toLocaleString("en-US")}
                      {tx.type === "credit" ? "+" : "-"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {showWithdrawModal && (
        <WithdrawalModal
          maxAmount={wallet?.balance ?? 0}
          technicianName={technicianName}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={() => {
            setShowWithdrawModal(false);
            fetchWallet();
          }}
        />
      )}
    </div>
  );
}