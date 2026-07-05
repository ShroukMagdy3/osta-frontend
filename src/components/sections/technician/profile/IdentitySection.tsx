"use client";

import { useRef, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Upload,
  RefreshCw,
  Loader2,
  Clock,
} from "lucide-react";
import { api } from "@/api/axios";
import Button from "@/components/ui/Button";

// ─── Types ──────────────────────────────────────────────────────────────────

type VerificationStatus = "incomplete" | "pending" | "approved" | "rejected";

interface IdentitySectionProps {
  verificationStatus: VerificationStatus;
  verifiedAt?: string | Date | null;
  rejectionReason?: string | null;
  idFrontImage?: string | null;
  idBackImage?: string | null;
  personalImage?: string | null;
  certificateImage?: string | null;
  criminalRecordImage?: string | null;
  onResubmitted?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(date?: string | Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

// Derive per-doc status from overall verificationStatus + whether a URL exists.
// Since backend stores only one rejectionReason (no per-doc status), we infer:
//  - approved: all docs مقبول
//  - pending: all docs "قيد المراجعة"
//  - rejected: docs that exist = "يحتاج إعادة رفع", missing = "لم يُرفع"
//  - incomplete: same as rejected display
type DocStatus = "approved" | "pending" | "needs_reupload" | "not_uploaded";

function deriveDocStatus(
  hasImage: boolean,
  overallStatus: VerificationStatus,
): DocStatus {
  if (overallStatus === "approved") return "approved";
  if (overallStatus === "pending") return "pending";
  if (!hasImage) return "not_uploaded";
  return "needs_reupload";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DocStatusBadge({ status }: { status: DocStatus }) {
  if (status === "approved")
    return (
      <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
        <CheckCircle2 size={12} />
        مقبول
      </span>
    );
  if (status === "pending")
    return (
      <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-600">
        <Clock size={12} />
        قيد المراجعة
      </span>
    );
  if (status === "needs_reupload")
    return (
      <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">
        <XCircle size={12} />
        يحتاج إعادة رفع
      </span>
    );
  return (
    <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-400">
      <Upload size={12} />
      لم يُرفع
    </span>
  );
}

// Single optional-doc row with its own file picker
function OptionalDocRow({
  label,
  hasImage,
  status,
  onUpload,
  uploading,
}: {
  label: string;
  hasImage: boolean;
  status: DocStatus;
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const btnLabel = hasImage ? "إعادة الرفع" : "رفع مستند";

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />

      {/* Left: upload button */}
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-[#112D27] transition-all hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Upload size={12} />
        )}
        {btnLabel}
      </button>

      {/* Right: label + status */}
      <div className="flex flex-1 items-center justify-end gap-3">
        <DocStatusBadge status={status} />
        <span className="text-sm font-medium text-[#112D27]">{label}</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IdentitySection({
  verificationStatus,
  verifiedAt,
  rejectionReason,
  idFrontImage,
  idBackImage,
  personalImage,
  certificateImage,
  criminalRecordImage,
  onResubmitted,
}: IdentitySectionProps) {
  // Files for bulk re-submit (required docs)
  const [requiredFiles, setRequiredFiles] = useState<{
    idFrontImage: File | null;
    idBackImage: File | null;
    personalImage: File | null;
  }>({ idFrontImage: null, idBackImage: null, personalImage: null });

  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitError, setResubmitError] = useState("");

  // Per-doc uploading state for optional docs
  const [uploadingCert, setUploadingCert] = useState(false);
  const [uploadingCriminal, setUploadingCriminal] = useState(false);
  const [optError, setOptError] = useState("");

  const isApproved = verificationStatus === "approved";
  const isPending = verificationStatus === "pending";
  const needsAction =
    verificationStatus === "rejected" || verificationStatus === "incomplete";

  // Required doc statuses
  const frontStatus = deriveDocStatus(!!idFrontImage, verificationStatus);
  const backStatus = deriveDocStatus(!!idBackImage, verificationStatus);
  const selfieStatus = deriveDocStatus(!!personalImage, verificationStatus);

  // Optional doc statuses
  const certStatus = deriveDocStatus(!!certificateImage, verificationStatus);
  const criminalStatus = deriveDocStatus(
    !!criminalRecordImage,
    verificationStatus,
  );

  // ── Re-submit all required docs ─────────────────────────────────────────────
  const handleResubmit = async () => {
    setResubmitError("");
    // Must provide all 3 required docs
    if (
      !requiredFiles.idFrontImage ||
      !requiredFiles.idBackImage ||
      !requiredFiles.personalImage
    ) {
      setResubmitError(
        "يرجى اختيار جميع المستندات المطلوبة الثلاثة قبل إعادة التحقق",
      );
      return;
    }
    setResubmitting(true);
    try {
      const formData = new FormData();
      formData.append("idFrontImage", requiredFiles.idFrontImage);
      formData.append("idBackImage", requiredFiles.idBackImage);
      formData.append("personalImage", requiredFiles.personalImage);

      await api.post("/technician/step5", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onResubmitted?.();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setResubmitError(
        Array.isArray(msg) ? msg[0] : msg || "حدث خطأ، حاول مرة أخرى",
      );
    } finally {
      setResubmitting(false);
    }
  };

  // ── Upload single optional doc ───────────────────────────────────────────────
  const uploadOptional = async (
    field: "certificateImage" | "criminalRecordImage",
    file: File,
    setUploading: (v: boolean) => void,
  ) => {
    setOptError("");
    setUploading(true);
    try {
      const formData = new FormData();
      // Must include all 3 required docs too (backend step5 requires them)
      // Since we don't have File objects for existing ones, pass existing URLs
      // as a note — actually backend requires File uploads, not URLs.
      // We'll need all 5 fields or at least the 3 required.
      // Since this is optional-only upload, we tell the user they need to use
      // the main re-submit flow to update everything together.
      formData.append(field, file);
      // For optional-only updates, if backend requires required docs too,
      // we pass the existing image paths as a signal — but since backend
      // uses multer files only, this flow requires a dedicated endpoint.
      // For now: gracefully inform user to use the full re-submit button.
      setOptError(
        "لتحديث المستندات الاختيارية، استخدم زر «إعادة التحقق» أعلاه وأرفق جميع المستندات معاً",
      );
    } finally {
      setUploading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div dir="ltr" className="flex flex-col gap-4">
      {/* ── Section header ── */}
      <div
  className="flex items-start gap-3 rounded-[24px] border border-[#EAECE8] bg-white px-6 py-5 shadow-sm"
  dir="rtl"
>
  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--secondary-color)]">
    <ShieldCheck size={16} className="text-[var(--primary-color)]" />
  </div>

  <div className="text-right">
    <h2 className="text-base font-bold text-[#112D27]">
      التحقق من الهوية
    </h2>
    <p className="mt-1 text-xs text-gray-400">
      المستندات التي تساعدنا على تأكيد هويتك ورفع ثقة العملاء
    </p>
  </div>
</div>

      {/* ── Status banner ── */}
      {isApproved ? (
        <div className="rounded-[20px] bg-[var(--secondary-color)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-[var(--primary-color)]">
              <CheckCircle2 size={18} className="text-[var(--primary-color)]" />
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--primary-color)]">
              <CheckCircle2 size={12} />
              موثّق
            </span>
          </div>
          <h3 className="text-right text-base font-bold text-[var(--primary-color)]">
            تم التحقق من الهوية
          </h3>
          <p className="mt-1 text-right text-xs text-[var(--primary-color)]/70">
            جميع مستنداتك مكتملة و معتمدة من فريق أسطى
            {verifiedAt && (
              <>
                {" "}
                . تاريخ التحقق: <strong>{formatDate(verifiedAt)}</strong>
              </>
            )}
          </p>
        </div>
      ) : isPending ? (
        <div className="rounded-[20px] border border-yellow-200 bg-yellow-50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <Clock size={20} className="text-yellow-500" />
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-600">
              قيد المراجعة
            </span>
          </div>
          <h3 className="text-right text-base font-bold text-yellow-700">
            جاري مراجعة مستنداتك
          </h3>
          <p className="mt-1 text-right text-xs text-yellow-600">
            سيتم إشعارك فور اكتمال عملية التحقق من فريق أسطى
          </p>
        </div>
      ) : (
        <div className="rounded-[20px] border border-gray-100 bg-gray-50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <AlertTriangle size={20} className="text-orange-400" />
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500">
              {verificationStatus === "rejected" ? "مرفوض" : "غير مكتمل"}
            </span>
          </div>
          <h3 className="text-right text-base font-bold text-[#112D27]">
            لم يكتمل التحقق من الهوية
          </h3>
          <p className="mt-1 text-right text-xs text-gray-400">
            {rejectionReason ||
              "بعض المستندات تحتاج إلى إعادة رفع. راجع القائمة بالأسفل ثم أعد المحاولة"}
          </p>
        </div>
      )}

      {/* ── Required documents card ── */}
      <div className="rounded-[20px] border border-[#EAECE8] bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3">
          {/* بطاقة الهوية — الوجه */}
          <div className="flex items-center justify-between gap-3">
            <DocStatusBadge status={frontStatus} />
            <span className="flex-1 text-right text-sm text-[#112D27]">
              بطاقة الهوية — الوجه
            </span>
          </div>

          {/* بطاقة الهوية — الظهر */}
          <div className="flex items-center justify-between gap-3">
            <DocStatusBadge status={backStatus} />
            <span className="flex-1 text-right text-sm text-[#112D27]">
              بطاقة الهوية — الظهر
            </span>
          </div>

          {/* صورة شخصية مع الهوية */}
          <div className="flex items-center justify-between gap-3">
            <DocStatusBadge status={selfieStatus} />
            <span className="flex-1 text-right text-sm text-[#112D27]">
              صورة شخصية مع الهوية
            </span>
          </div>
        </div>

        {/* File pickers for re-submit (only shown when action needed) */}
        {needsAction && (
          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
            <p className="text-right text-xs text-gray-400">
              اختر المستندات الجديدة ثم اضغط «إعادة التحقق»
            </p>

            {[
              { key: "idFrontImage" as const, label: "بطاقة الهوية — الوجه" },
              { key: "idBackImage" as const, label: "بطاقة الهوية — الظهر" },
              { key: "personalImage" as const, label: "صورة شخصية مع الهوية" },
            ].map(({ key, label }) => {
              const chosen = requiredFiles[key];
              return (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-gray-200 px-4 py-3 transition-all hover:border-[var(--primary-color)]"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setRequiredFiles((prev) => ({ ...prev, [key]: file }));
                      e.target.value = "";
                    }}
                  />
                  <span className="flex items-center gap-1.5 text-xs text-[var(--primary-color)]">
                    <Upload size={13} />
                    {chosen ? chosen.name : "اختر ملف"}
                  </span>
                  <span className="text-sm text-gray-500">{label}</span>
                </label>
              );
            })}

            {resubmitError && (
              <p className="text-right text-xs text-red-500">{resubmitError}</p>
            )}

            <Button
              onClick={handleResubmit}
              disabled={resubmitting}
              className="mt-1 !py-2.5 !text-sm"
            >
              {resubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  جاري الإرسال...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={14} />
                  إعادة التحقق
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* ── Optional documents card ── */}
      <div className="rounded-[24px] border border-[#EAECE8] bg-white px-6 py-5 shadow-sm">
        <div className="mb-1 flex items-start  gap-3" dir="rtl">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--secondary-color)]">
            <ShieldCheck size={16} className="text-[var(--primary-color)]" />
          </div>
          <div className="text-right">
            <h3 className="text-base font-bold text-[#112D27]">
              المستندات الإضافية
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              رفع هذه المستندات اختياري. لكنه يساعد في زيادة مصداقيتك وإظهار
              حسابك للعملاء بشكل أكثر، مما يزيد فرص حصولك على الطلبات.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <OptionalDocRow
            label="شهادة الخبرة"
            hasImage={!!certificateImage}
            status={certStatus}
            uploading={uploadingCert}
            onUpload={(file) =>
              uploadOptional("certificateImage", file, setUploadingCert)
            }
          />
          <OptionalDocRow
            label="صحيفة الحالة الجنائية"
            hasImage={!!criminalRecordImage}
            status={criminalStatus}
            uploading={uploadingCriminal}
            onUpload={(file) =>
              uploadOptional("criminalRecordImage", file, setUploadingCriminal)
            }
          />
        </div>

        {optError && (
          <p className="mt-3 text-right text-xs text-orange-500">{optError}</p>
        )}
      </div>
    </div>
  );
}
