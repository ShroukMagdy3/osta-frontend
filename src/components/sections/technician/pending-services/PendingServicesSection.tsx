"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Clock3, MapPin, MoreVertical } from "lucide-react";
import Button from "@/components/ui/Button";
import type { AssignedRequest, RequestStatus } from "@/types/request.types";
import ChatButton from "../../client/direct-messages/ChatButton";
import RequestOptionsMenu from "../../shared/RequestOptionsMenu";
import CancelRequestModal from "../../shared/CancelRequestModal";

type PendingFilter = "all" | "awaiting-client" | "awaiting-deposit";

const FILTER_RENDER_ORDER: PendingFilter[] = [
  "awaiting-deposit",
  "awaiting-client",
  "all",
];

const PENDING_STATUSES: RequestStatus[] = ["pending", "accepted"];

const FILTER_LABELS: Record<PendingFilter, string> = {
  all: "الكل",
  "awaiting-client": "بانتظار رد العميل",
  "awaiting-deposit": "بانتظار دفع العربون",
};

const STATUS_STYLES: Record<
  RequestStatus,
  { label: string; className: string; dotClassName: string }
> = {
  pending: {
    label: "بانتظار رد العميل",
    className: "bg-[#EDE9FE] text-[#6668C4]",
    dotClassName: "bg-[#6668C4]",
  },
  accepted: {
    label: "بانتظار دفع العربون",
    className: "bg-[#FFECCD] text-[#D97706]",
    dotClassName: "bg-[#F59E0B]",
  },
  in_progress: {
    label: "قيد التنفيذ",
    className: "bg-[#E6F7E8] text-[#2A7E43]",
    dotClassName: "bg-[#2A7E43]",
  },
  on_the_way: {
    label: "في الطريق",
    className: "bg-[#E7F3F1] text-[#1C4B41]",
    dotClassName: "bg-[#1C4B41]",
  },
  started: {
    label: "بدأ التنفيذ",
    className: "bg-[#E8F6F3] text-[#13795B]",
    dotClassName: "bg-[#13795B]",
  },
  completed: {
    label: "مكتملة",
    className: "bg-slate-100 text-slate-500",
    dotClassName: "bg-slate-400",
  },
  cancelled: {
    label: "ملغية",
    className: "bg-red-100 text-red-600",
    dotClassName: "bg-red-500",
  },
};

const formatDateAndTime = (date?: string, time?: string) => {
  if (!date && !time) {
    return "غير محدد";
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
      })
    : "غير محدد";

  if (!time) {
    return formattedDate;
  }

  const normalizedTime = time.replace(/\s?(AM|PM)$/i, "");
  const [hourPart = "0", minutePart = "00"] = normalizedTime.split(":");
  const parsedHour = Number.parseInt(hourPart, 10);

  if (Number.isNaN(parsedHour)) {
    return `${formattedDate} - ${time}`;
  }

  const period = parsedHour < 12 ? "صباحًا" : "مساءً";
  const hour12 = parsedHour % 12 || 12;

  return `${formattedDate} - ${hour12}:${minutePart} ${period}`;
};

const formatCurrency = (value?: number) => {
  if (typeof value !== "number") {
    return "غير محدد";
  }

  return `${new Intl.NumberFormat("ar-EG").format(value)} جنيه`;
};

const getPriceLabel = (request: AssignedRequest) => {
  const min = request.serviceId?.priceRange?.min;
  const max = request.serviceId?.priceRange?.max;

  if (typeof min === "number" && typeof max === "number") {
    return `${new Intl.NumberFormat("ar-EG").format(min)} - ${new Intl.NumberFormat(
      "ar-EG",
    ).format(max)} جنيه`;
  }

  if (typeof request.postId?.acceptedProposal?.price === "number") {
    return formatCurrency(request.postId.acceptedProposal.price);
  }

  if (typeof request.postId?.budget === "number") {
    return formatCurrency(request.postId.budget);
  }

  if (typeof request.totalPrice === "number" && request.totalPrice > 0) {
    return formatCurrency(request.totalPrice);
  }

  return "غير محدد";
};

const getPrimaryTitle = (request: AssignedRequest) =>
  request.serviceId?.name ||
  request.postId?.title ||
  request.title ||
  "خدمة بدون عنوان";

const getCategoryLabel = (request: AssignedRequest) =>
  request.serviceId?.name ? "خدمة شائعة" : "خدمة مخصصة";

const getLocationLabel = (request: AssignedRequest) =>
  request.address?.district ||
  request.address?.fullAddress ||
  [request.userId?.city, request.userId?.governorate]
    .filter(Boolean)
    .join("، ") ||
  "العنوان غير متاح";

const getRequestSummary = (request: AssignedRequest) =>
  request.notes ||
  request.completionNote ||
  "لا توجد تفاصيل إضافية متاحة لهذا الطلب حاليًا.";

const getChatRequestId = (request: AssignedRequest) => {
  if (request.chatRequestId) return request.chatRequestId;
  if (request.pendingSource === "proposal") return null;
  return request._id;
};

const isPendingRequest = (request: AssignedRequest) =>
  PENDING_STATUSES.includes(request.status);

const isAwaitingClient = (request: AssignedRequest) =>
  request.status === "pending";

const isAwaitingDeposit = (request: AssignedRequest) =>
  request.status === "accepted" || request.depositStatus === "unpaid";

const filterRequestByTab = (
  request: AssignedRequest,
  filter: PendingFilter,
) => {
  if (!isPendingRequest(request)) {
    return false;
  }

  if (filter === "awaiting-client") {
    return isAwaitingClient(request);
  }

  if (filter === "awaiting-deposit") {
    return isAwaitingDeposit(request);
  }

  return true;
};

interface PendingServicesSectionProps {
  requests: AssignedRequest[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  activeServicesCount: number;
  onCancelled?: () => void;
}

function FilterChip({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? "border-transparent bg-[var(--primary-color)] text-white shadow-sm"
          : "border-[#E8ECEB] bg-white text-[#4E625D] hover:border-[#CFD8D6]"
      }`}
    >
      <span
        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs ${
          active
            ? "bg-[var(--accent-color)] text-[var(--primary-color)]"
            : "bg-[#F5F7F6] text-[#7A8F89]"
        }`}
      >
        {count}
      </span>
      <span>{label}</span>
    </button>
  );
}

function PendingServiceCard({
  request,
  onCancelled,
}: {
  request: AssignedRequest;
  onCancelled?: () => void;
}) {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const statusStyle = STATUS_STYLES[request.status] || STATUS_STYLES.pending;
  const customerName = request.userId?.fullName || "عميل غير معروف";
  const chatRequestId = getChatRequestId(request);
  const isCustomRequest =
    !request.serviceId?.name && Boolean(request.postId?._id);

  const openOrderDetails = () => {
  // لو الطلب من post (خدمة مخصصة) → روح لصفحة الـ post
  if (request.postId?._id) {
    router.push(`/technician/services/${request.postId._id}`);
  } else {
    // لو خدمة عادية → نفس الـ routing القديم
    const detailsId = request.requestId ?? request._id;
    router.push(`/technician/portfolio/pending/${detailsId}`);
  }
};

  return (
    <article
      dir="rtl"
      className="rounded-[20px] border border-[#EAEAEA] bg-white p-5 text-right shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h3 className="truncate text-[18px] font-bold leading-tight text-[var(--primary-color)]">
            {getPrimaryTitle(request)}
          </h3>
          <span className="shrink-0 rounded-full bg-[#F1F7E7] px-3 py-2 text-xs font-semibold text-[#1C4B41]">
            {getCategoryLabel(request)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.className}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${statusStyle.dotClassName}`}
            />
            {statusStyle.label}
          </span>
          {/* الإلغاء من هنا متاح بس للطلبات الثابتة — الـ custom requests
              بتتلغي من العميل (cancelPost)، الفني هنا ممكن يلغي عرضه بس
              مش الطلب نفسه */}
          {!isCustomRequest && (
            <RequestOptionsMenu
              status={request.status}
              onCancelClick={() => setShowCancelModal(true)}
            />
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="rounded-2xl border border-[#EDF1EF] bg-[#F8FAF9] px-4 py-4 text-sm leading-7 text-[#5F6E69]">
          {getRequestSummary(request)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-[#F8FAF9] px-4 py-4 text-right">
          <p className="text-xs text-[#8B9995]">العميل</p>
          <p className="mt-1.5 font-bold text-[var(--primary-color)]">
            {customerName}
          </p>
        </div>
        <div className="rounded-2xl bg-[#F8FAF9] px-4 py-4 text-right">
          <p className="text-xs text-[#8B9995]">نطاق السعر</p>
          <p className="mt-1.5 font-bold text-[var(--primary-color)]">
            {getPriceLabel(request)}
          </p>
        </div>
        <div className="rounded-2xl bg-[#F8FAF9] px-4 py-4 text-right">
          <p className="text-xs text-[#8B9995]">تاريخ الطلب</p>
          <p className="mt-1.5 font-bold text-[var(--primary-color)]">
            {formatDateAndTime(request.preferredDate, request.preferredTime)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 text-sm text-[#70817C]">
        <span className="flex items-center gap-2">
          <MapPin size={16} className="shrink-0 text-[#B3E718]" />
          <span>{getLocationLabel(request)}</span>
        </span>
        {chatRequestId ? (
          <ChatButton requestId={chatRequestId} role="technician" />
        ) : isCustomRequest ? (
          <ChatButton
            role="technician"
            customChat={{
              postId: request.postId!._id!,
              title: getPrimaryTitle(request),
              clientName: customerName,
            }}
          />
        ) : null}
      </div>

      {isCustomRequest ? (
        <div className="mt-4">
          <Button
            className="!w-full !justify-between !rounded-2xl !bg-[#F2EEFC] !px-5 !py-3 !text-sm !font-bold !text-[var(--primary-color)] hover:!bg-[#ECE6FB]"
            onClick={openOrderDetails}
          >
            <span className="text-[#8B80B8]">‹</span>
            <span>عرض تفاصيل الطلب</span>
          </Button>
        </div>
      ) : null}

      {showCancelModal && (
        <CancelRequestModal
          requestId={request._id}
          role="technician"
          serviceName={getPrimaryTitle(request)}
          onClose={() => setShowCancelModal(false)}
          onCancelled={() => onCancelled?.()}
        />
      )}
    </article>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-[#EEF1EF] bg-white shadow-[0_12px_32px_rgba(28,75,65,0.05)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent-color)] border-t-transparent" />
        <p className="text-sm text-[#6E7E79]">جارٍ تحميل الخدمات المعلقة...</p>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-[#F4D9D9] bg-[#FFF8F8] p-8 text-center">
      <div className="max-w-md">
        <AlertCircle className="mx-auto h-10 w-10 text-[#C75B5B]" />
        <h3 className="mt-4 text-xl font-bold text-[var(--primary-color)]">
          تعذر تحميل الطلبات
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#7C6F6F]">{message}</p>
        <Button className="mt-6" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-dashed border-[#DCE4E1] bg-[#FBFCFB] p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F7E7] text-[var(--primary-color)]">
          <Clock3 size={26} />
        </div>
        <h3 className="mt-5 text-xl font-bold text-[var(--primary-color)]">
          لا توجد خدمات معلقة الآن
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#6B7A76]">
          ستظهر هنا الطلبات التي ما زالت في انتظار استكمال الخطوات قبل بدء
          التنفيذ.
        </p>
      </div>
    </div>
  );
}

export default function PendingServicesSection({
  requests,
  loading,
  error,
  onRetry,
  activeServicesCount,
  onCancelled,
}: PendingServicesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<PendingFilter>("all");

  const pendingRequests = useMemo(
    () => requests.filter(isPendingRequest),
    [requests],
  );

  const filterCounts = useMemo(
    () => ({
      all: pendingRequests.length,
      "awaiting-client": pendingRequests.filter(isAwaitingClient).length,
      "awaiting-deposit": pendingRequests.filter(isAwaitingDeposit).length,
    }),
    [pendingRequests],
  );

  const visibleRequests = useMemo(
    () =>
      pendingRequests.filter((request) =>
        filterRequestByTab(request, activeFilter),
      ),
    [activeFilter, pendingRequests],
  );

  const router = useRouter();

  return (
    <section className="section-wrapper !max-w-[1180px] !px-0" dir="rtl">
      <div
        className="mb-8 flex w-full flex-wrap items-center justify-start gap-3 px-2 md:px-0"
        dir="rtl"
      >
        {activeServicesCount > 0 && (
          <button
            type="button"
            onClick={() => router.push("/technician/portfolio/current")}
            className="mb-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-[#B3E718] bg-[#F1F7E7] px-5 py-4 text-right transition hover:bg-[#E8F5D0]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B3E718] text-sm font-bold text-[#1C4B41]">
                {activeServicesCount}
              </span>
              <span className="text-sm font-bold text-[#1C4B41]">
                لديك{" "}
                {activeServicesCount === 1
                  ? "خدمة نشطة"
                  : `${activeServicesCount} خدمات نشطة`}{" "}
                جارية الآن
              </span>
            </div>
            <span className="text-sm font-semibold text-[#1C4B41] underline underline-offset-2">
              عرض الخدمات النشطة ←
            </span>
          </button>
        )}

        {/* الفلاتر الموجودة */}
        <div className="mb-8 flex w-full flex-wrap ..."></div>
        {FILTER_RENDER_ORDER.map((filterKey) => (
          <FilterChip
            key={filterKey}
            active={activeFilter === filterKey}
            count={filterCounts[filterKey]}
            label={FILTER_LABELS[filterKey]}
            onClick={() => setActiveFilter(filterKey)}
          />
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : visibleRequests.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" dir="rtl">
          {visibleRequests.map((request) => (
            <PendingServiceCard
              key={request._id}
              request={request}
              onCancelled={onCancelled}
            />
          ))}
        </div>
      )}
    </section>
  );
}
