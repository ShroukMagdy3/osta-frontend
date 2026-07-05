"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock3,
  LoaderCircle,
  ShieldAlert,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { API_URL } from "@/constants/api";
import {
  approveTechnician,
  getPendingTechnicians,
  rejectTechnician,
} from "@/services/admin.service";
import { AdminTechnician, PaginationMeta } from "@/types/admin.types";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

const EMPTY_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

function formatDate(value?: string) {
  if (!value) {
    return "غير متوفر";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function buildAssetUrl(path?: string) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.replace(/\\/g, "/");
  const uploadsIndex = normalizedPath.indexOf("/uploads/");
  const publicPath =
    uploadsIndex >= 0
      ? normalizedPath.slice(uploadsIndex)
      : normalizedPath.startsWith("/uploads/")
        ? normalizedPath
        : `/${normalizedPath.replace(/^\/+/, "")}`;

  return `${API_URL}${publicPath}`;
}

function TechnicianDocumentCard({
  title,
  path,
  required = false,
}: {
  title: string;
  path?: string;
  required?: boolean;
}) {
  const assetUrl = buildAssetUrl(path);

  return (
    <div className="rounded-[24px] border border-[#E7ECE7] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--primary-color)]">
            {title}
          </p>
          <p className="mt-1 text-xs text-[#7A8A84]">
            {required ? "مستند مطلوب للمراجعة" : "مستند اختياري"}
          </p>
        </div>
        {assetUrl ? (
          <a
            href={assetUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#D7E3DC] px-3 py-2 text-xs font-medium text-[var(--primary-color)] transition-all hover:border-[var(--accent-color)] hover:bg-[#F7FCEB]"
          >
            فتح الملف
          </a>
        ) : null}
      </div>

      {assetUrl ? (
        <div className="mt-4 overflow-hidden rounded-[20px] border border-[#EEF2EE] bg-[#FAFCF9]">
          <img
            src={assetUrl}
            alt={title}
            className="h-56 w-full object-cover"
          />
        </div>
      ) : (
        <div className="mt-4 rounded-[20px] border border-dashed border-[#D6E1DA] bg-[#FBFCFA] px-4 py-8 text-center text-sm text-[#71847C]">
          {required
            ? "لم يتم العثور على هذا الملف رغم أنه مطلوب."
            : "لا يوجد ملف مرفوع لهذا المستند."}
        </div>
      )}
    </div>
  );
}

function ActionResultModal({
  feedback,
  onClose,
}: {
  feedback: Exclude<FeedbackState, null>;
  onClose: () => void;
}) {
  const isSuccess = feedback.type === "success";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl"
        dir="rtl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 flex h-7 w-7 items-center justify-center rounded-full text-gray-300 transition-colors hover:text-gray-500"
        >
          <X size={18} />
        </button>

        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            isSuccess ? "bg-[#F0F9E8]" : "bg-red-50"
          }`}
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${
              isSuccess
                ? "bg-[var(--accent-color)]"
                : "bg-red-500"
            }`}
          >
            {isSuccess ? (
              <Check
                size={28}
                className="text-[var(--primary-color)]"
                strokeWidth={3}
              />
            ) : (
              <AlertCircle size={28} className="text-white" strokeWidth={2.5} />
            )}
          </div>
        </div>

        <h2 className="mb-2 text-xl font-bold text-[var(--primary-color)]">
          {isSuccess ? "تمت العملية بنجاح" : "تعذر إتمام العملية"}
        </h2>
        <p className="mb-8 text-sm leading-7 text-gray-400">{feedback.message}</p>

        <Button fullWidth onClick={onClose}>
          {isSuccess ? "حسناً" : "إغلاق"}
        </Button>
      </div>
    </div>
  );
}

export default function TechnicianReviewsPage() {
  const [pendingTechnicians, setPendingTechnicians] = useState<AdminTechnician[]>([]);
  const [pendingMeta, setPendingMeta] = useState<PaginationMeta>(EMPTY_META);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);

  const effectiveSelectedTechnicianId =
    selectedTechnicianId ?? pendingTechnicians[0]?._id ?? null;

  const selectedTechnician = useMemo(
    () =>
      pendingTechnicians.find(
        (technician) => technician._id === effectiveSelectedTechnicianId,
      ) ?? null,
    [effectiveSelectedTechnicianId, pendingTechnicians],
  );

  const loadPendingTechnicians = async () => {
    setLoading(true);
    const { data } = await getPendingTechnicians();
    setPendingTechnicians(data.data);
    setPendingMeta(data.meta);
    setLoading(false);
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setError("");
        await loadPendingTechnicians();
      } catch {
        setError("تعذر تحميل طلبات مراجعة الفنيين حالياً.");
        setLoading(false);
      }
    };

    void loadPage();
  }, []);

  const handleApprove = async (technicianId: string) => {
    try {
      setSubmittingAction(technicianId);
      setFeedback(null);
      await approveTechnician(technicianId);
      setRejectReason("");
      setFeedback({
        type: "success",
        message: "تمت الموافقة على الفني بنجاح.",
      });
      await loadPendingTechnicians();
      if (selectedTechnicianId === technicianId) {
        setSelectedTechnicianId(null);
      }
    } catch {
      setFeedback({
        type: "error",
        message:
          "تعذرت الموافقة على الفني. تحقق من اكتمال بياناته ثم أعد المحاولة.",
      });
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleReject = async (technicianId: string) => {
    if (!rejectReason.trim()) {
      setFeedback({
        type: "error",
        message: "اكتب سبب الرفض قبل إرسال القرار.",
      });
      return;
    }

    try {
      setSubmittingAction(technicianId);
      setFeedback(null);
      await rejectTechnician(technicianId, rejectReason.trim());
      setRejectReason("");
      setFeedback({
        type: "success",
        message: "تم رفض طلب الفني مع حفظ سبب الرفض.",
      });
      await loadPendingTechnicians();
      if (selectedTechnicianId === technicianId) {
        setSelectedTechnicianId(null);
      }
    } catch {
      setFeedback({
        type: "error",
        message: "تعذر رفض الطلب الآن. حاول مرة أخرى.",
      });
    } finally {
      setSubmittingAction(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-[linear-gradient(180deg,#F5FAF4_0%,#FCFDFB_28%,#F7F8F6_100%)]"
      dir="rtl"
    >
      <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="rounded-[38px] border border-[#DDE8E1] bg-[radial-gradient(circle_at_top_right,rgba(179,231,24,0.22),transparent_30%),linear-gradient(135deg,#163D35_0%,#1C4B41_45%,#2F6254_100%)] p-7 text-white shadow-[0_24px_70px_rgba(17,45,39,0.18)] md:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/90">
                <ShieldAlert size={14} />
                صفحة مخصصة لمراجعة الفنيين الجدد
              </span>
              <h1 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
                فحص الملفات والبيانات قبل اعتماد الفني أو رفضه
              </h1>
              <p className="mt-4 text-sm leading-8 text-white/78 md:text-base">
                هنا يتم عرض كل طلبات التسجيل المعلقة، مع الملفات المرفوعة وبيانات
                العمل وملاحظات الرفض، حتى تكون قرارات الإدارة أوضح وأسرع.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-white/15"
              >
                <ArrowRight size={16} />
                العودة إلى لوحة التحكم
              </Link>
              <span className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium">
                {loading ? "جارٍ التحميل..." : `${pendingMeta.total} طلب مراجعة`}
              </span>
            </div>
          </div>
        </section>

        {error ? (
          <div className="flex items-start gap-3 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-[34px] border border-[#E4ECE7] bg-white/90 shadow-[0_20px_60px_rgba(17,45,39,0.08)]">
            <LoaderCircle
              className="animate-spin text-[var(--primary-color)]"
              size={34}
            />
          </div>
        ) : pendingTechnicians.length === 0 ? (
          <div className="rounded-[34px] border border-[#E4ECE7] bg-white/90 p-6 text-center shadow-[0_20px_60px_rgba(17,45,39,0.08)] sm:p-12">
            <Clock3 className="mx-auto text-[#8AA198]" size={34} />
            <p className="mt-5 text-2xl font-bold text-[var(--primary-color)]">
              لا توجد طلبات مراجعة حالياً
            </p>
            <p className="mt-3 text-sm text-[#73867F]">
              عندما ينهي الفنيون خطوات التسجيل سيظهرون هنا لاتخاذ قرار الاعتماد.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[34px] border border-[#E4ECE7] bg-white/90 p-5 shadow-[0_20px_60px_rgba(17,45,39,0.08)]">
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#EEF2EE] pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--primary-color)]">
                    قائمة المراجعات
                  </h2>
                  <p className="mt-2 text-sm text-[#6C7E77]">
                    اختر طلباً لعرض الملفات واتخاذ القرار.
                  </p>
                </div>
                <span className="rounded-full bg-[#F5FAF2] px-4 py-2 text-sm font-medium text-[var(--primary-color)]">
                  {pendingMeta.total} طلب
                </span>
              </div>

              <div className="space-y-3">
                {pendingTechnicians.map((technician) => {
                  const active = selectedTechnician?._id === technician._id;
                  return (
                    <button
                      key={technician._id}
                      type="button"
                      onClick={() => {
                        setSelectedTechnicianId(technician._id);
                        setRejectReason(technician.rejectionReason ?? "");
                      }}
                      className={`w-full rounded-[26px] border p-4 text-right transition-all ${
                        active
                          ? "border-[var(--accent-color)] bg-[#F7FCEB] shadow-sm"
                          : "border-[#E6ECE8] bg-[#FCFDFC] hover:border-[#C9D8D0]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-bold text-[var(--primary-color)]">
                            {technician.userId.fullName}
                          </p>
                          <p className="mt-1 text-sm text-[#6D8179]">
                            {technician.userId.email}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#587169]">
                          خطوة {technician.currentStep}/5
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-[#EEF5F1] px-3 py-1 text-[#31554B]">
                          {technician.yearsOfExperience} سنة خبرة
                        </span>
                        <span className="rounded-full bg-[#EEF5F1] px-3 py-1 text-[#31554B]">
                          {technician.workingDays.length} أيام عمل
                        </span>
                        <span className="rounded-full bg-[#EEF5F1] px-3 py-1 text-[#31554B]">
                          {technician.serviceAreas.length} مناطق خدمة
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedTechnician ? (
              <div className="rounded-[34px] border border-[#E4ECE7] bg-white/90 p-6 shadow-[0_20px_60px_rgba(17,45,39,0.08)]">
                <div className="flex flex-col gap-4 border-b border-[#E7ECE7] pb-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        قيد المراجعة
                      </span>
                      <h3 className="mt-4 text-2xl font-bold text-[var(--primary-color)]">
                        {selectedTechnician.userId.fullName}
                      </h3>
                      <p className="mt-2 text-sm text-[#6D8179]">
                        {selectedTechnician.userId.email}
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-[#DDE8E1] bg-white p-4 text-sm text-[#5F726B]">
                      <p>
                        تاريخ الانضمام:{" "}
                        {formatDate(selectedTechnician.userId.createdAt)}
                      </p>
                      <p className="mt-2">
                        الحالة البريدية:{" "}
                        {selectedTechnician.userId.isVerified
                          ? "تم التحقق"
                          : "بانتظار التحقق"}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[24px] bg-white p-4">
                      <p className="text-xs text-[#7A8A84]">رقم الهاتف</p>
                      <p className="mt-2 text-sm font-medium text-[var(--primary-color)]">
                        {selectedTechnician.userId.phone || "غير متوفر"}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-white p-4">
                      <p className="text-xs text-[#7A8A84]">
                        المدينة والمحافظة
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--primary-color)]">
                        {selectedTechnician.userId.city || "غير متوفر"}،{" "}
                        {selectedTechnician.userId.governorate || "غير متوفر"}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-white p-4">
                      <p className="text-xs text-[#7A8A84]">أوقات العمل</p>
                      <p className="mt-2 text-sm font-medium text-[var(--primary-color)]">
                        {selectedTechnician.startTime || "--"} إلى{" "}
                        {selectedTechnician.endTime || "--"}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-white p-4">
                      <p className="text-xs text-[#7A8A84]">
                        الأدوات والمواصلات
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--primary-color)]">
                        أدوات: {selectedTechnician.hasTools ? "نعم" : "لا"} •
                        مواصلات:{" "}
                        {selectedTechnician.hasTransportation ? "نعم" : "لا"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[24px] bg-white p-4">
                    <p className="text-sm font-semibold text-[var(--primary-color)]">
                      مناطق العمل
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedTechnician.serviceAreas.length ? (
                        selectedTechnician.serviceAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full bg-[#EFF5EF] px-3 py-1 text-xs text-[#31554B]"
                          >
                            {area}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[#71847C]">غير متوفرة</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-white p-4">
                    <p className="text-sm font-semibold text-[var(--primary-color)]">
                      أيام العمل
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedTechnician.workingDays.length ? (
                        selectedTechnician.workingDays.map((day) => (
                          <span
                            key={day}
                            className="rounded-full bg-[#EFF5EF] px-3 py-1 text-xs text-[#31554B]"
                          >
                            {day}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[#71847C]">غير متوفرة</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldAlert
                      size={18}
                      className="text-[var(--primary-color)]"
                    />
                    <h4 className="text-lg font-bold text-[var(--primary-color)]">
                      الملفات المرفوعة للمراجعة
                    </h4>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <TechnicianDocumentCard
                      title="الصورة الشخصية"
                      path={selectedTechnician.personalImage}
                      required
                    />
                    <TechnicianDocumentCard
                      title="صورة البطاقة الأمامية"
                      path={selectedTechnician.idFrontImage}
                      required
                    />
                    <TechnicianDocumentCard
                      title="صورة البطاقة الخلفية"
                      path={selectedTechnician.idBackImage}
                      required
                    />
                    <TechnicianDocumentCard
                      title="شهادة الخبرة"
                      path={selectedTechnician.certificateImage}
                    />
                    <TechnicianDocumentCard
                      title="الفيش الجنائي"
                      path={selectedTechnician.criminalRecordImage}
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] bg-white p-4">
                  <label
                    htmlFor="reject-reason"
                    className="text-sm font-semibold text-[var(--primary-color)]"
                  >
                    سبب الرفض عند الحاجة
                  </label>
                  <textarea
                    id="reject-reason"
                    value={rejectReason}
                    onChange={(event) => setRejectReason(event.target.value)}
                    placeholder="اكتب ملاحظات واضحة تساعد الفني على تعديل طلبه إذا لزم الأمر."
                    className="mt-3 min-h-28 w-full rounded-[22px] border border-[#D8E3DD] bg-[#FBFCFA] px-4 py-3 text-sm text-[#31554B] outline-none transition-all focus:border-[var(--accent-color)]"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => void handleReject(selectedTechnician._id)}
                    disabled={submittingAction === selectedTechnician._id}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {submittingAction === selectedTechnician._id
                      ? "جارٍ التنفيذ..."
                      : "رفض الطلب"}
                  </Button>
                  <Button
                    onClick={() => void handleApprove(selectedTechnician._id)}
                    disabled={submittingAction === selectedTechnician._id}
                  >
                    {submittingAction === selectedTechnician._id
                      ? "جارٍ التنفيذ..."
                      : "اعتماد الفني"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-[34px] border border-dashed border-[#D6E1DA] bg-[#FBFCFA] p-6 text-center text-sm text-[#71847C]">
                اختر طلباً من القائمة لعرض الملفات واتخاذ القرار.
              </div>
            )}
          </div>
        )}
      </div>

      {feedback ? (
        <ActionResultModal feedback={feedback} onClose={() => setFeedback(null)} />
      ) : null}
    </div>
  );
}
