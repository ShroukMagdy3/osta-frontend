"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  MessageCircle,
  MoreVertical,
} from "lucide-react";
import Button from "@/components/ui/Button";
import type { AssignedRequest, RequestStatus } from "@/types/request.types";
import { markRequestOnTheWay } from "@/api/services/request.service";
import ChatButton from "../../client/direct-messages/ChatButton";
import RequestOptionsMenu from "../../shared/RequestOptionsMenu";
import CancelRequestModal from "../../shared/CancelRequestModal";

const ACTIVE_STATUSES: RequestStatus[] = [
  "in_progress",
  "on_the_way",
  "started",
];

const formatCurrency = (value?: number) => {
  if (typeof value !== "number") {
    return "غير محدد";
  }

  return `${new Intl.NumberFormat("ar-EG").format(value)} جنيه`;
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
    return `${formattedDate}، ${time}`;
  }

  const period = parsedHour < 12 ? "صباحًا" : "مساءً";
  const hour12 = parsedHour % 12 || 12;
  return `${formattedDate}، ${hour12}:${minutePart} ${period}`;
};

const formatSince = (date?: string) => {
  if (!date) {
    return "الحالة قيد التحديث";
  }

  const diffMs = Date.now() - new Date(date).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `بدأت منذ ${diffMinutes} دقيقة`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `بدأت منذ ${diffHours} ساعة`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `بدأت منذ ${diffDays} يوم`;
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

  return "غير محدد";
};

const getPrimaryTitle = (request: AssignedRequest) =>
  request.serviceId?.name ||
  request.postId?.title ||
  request.title ||
  "خدمة بدون عنوان";

const getCategoryLabel = (request: AssignedRequest) =>
  request.serviceId?.name ? "خدمة شائعة" : "خدمة مخصصة";

const getSummary = (request: AssignedRequest) =>
  request.notes ||
  request.completionNote ||
  "لا توجد تفاصيل إضافية متاحة لهذا الطلب.";

const getLocationLabel = (request: AssignedRequest) =>
  request.address?.district ||
  request.address?.fullAddress ||
  [request.userId?.city, request.userId?.governorate]
    .filter(Boolean)
    .join("، ") ||
  "العنوان غير متاح";

const getCustomerName = (request: AssignedRequest) =>
  request.userId?.fullName || "عميل غير معروف";

const getCustomerInitial = (request: AssignedRequest) =>
  getCustomerName(request).trim().charAt(0) || "م";

const getStatusBadge = (status: RequestStatus) => {
  if (status === "in_progress") {
    return {
      label: "العميل في انتظارك",
      className: "bg-[#E6F3A6] text-[#31554B]",
    };
  }

  return {
    label: "نشطة",
    className: "bg-[#E6F3A6] text-[#31554B]",
  };
};

const getProgressBadge = (status: RequestStatus) => {
  if (status === "started") return "جار التنفيذ";
  if (status === "on_the_way") return "في الطريق";
  return null;
};

const getPrimaryActionLabel = (status: RequestStatus) =>
  status === "in_progress" ? "بدء الذهاب" : "تتبع الطلب";

function LoadingState() {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-[#EEF1EF] bg-white shadow-[0_12px_32px_rgba(28,75,65,0.05)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent-color)] border-t-transparent" />
        <p className="text-sm text-[#6E7E79]">جاري تحميل الخدمات النشطة...</p>
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
          تعذر تحميل الخدمات
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
          <BriefcaseBusiness size={26} />
        </div>
        <h3 className="mt-5 text-xl font-bold text-[var(--primary-color)]">
          لا توجد خدمات نشطة الآن
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#6B7A76]">
          ستظهر هنا الخدمات الجارية التي تعمل عليها فور توفرها.
        </p>
      </div>
    </div>
  );
}

function ActiveServiceCard({
  request,
  onRetry,
}: {
  request: AssignedRequest;
  onRetry: () => void;
}) {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const statusBadge = getStatusBadge(request.status);
  const progressBadge = getProgressBadge(request.status);

  return (
    <article
      dir="rtl"
      className="rounded-[28px] border border-[#B3E718] bg-white p-5 text-right shadow-[0_0_22px_rgba(179,231,24,0.18)] md:p-6"
    >
      <div className="flex items-start justify-between gap-4" dir="ltr">
        <div className="flex shrink-0 items-center gap-2" dir="ltr">
          <RequestOptionsMenu
            status={request.status}
            onCancelClick={() => setShowCancelModal(true)}
          />
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${statusBadge.className}`}
          >
            <Clock3 size={14} />
            {statusBadge.label}
          </span>
        </div>

        <div
          className="ml-auto inline-flex max-w-[74%] items-center justify-end gap-2"
          dir="rtl"
        >
          <h3 className="truncate text-[20px] font-bold leading-9 text-[var(--primary-color)] md:text-[18px]">
            {getPrimaryTitle(request)}
          </h3>
          <span className="shrink-0 rounded-full bg-[#F1F7E7] px-3 py-2 text-xs font-semibold text-[#1C4B41]">
            {getCategoryLabel(request)}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#E7ECE8] bg-[#FCFCFA] px-4 py-5 text-sm leading-8 text-[#5F6E69]">
        {getSummary(request)}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#F8FAF9] px-4 py-4 text-right">
          <p className="text-xs text-[#8B9995]">نطاق السعر</p>
          <p className="mt-2 font-bold text-[var(--primary-color)]">
            {getPriceLabel(request)}
          </p>
        </div>
        <div className="rounded-2xl bg-[#F8FAF9] px-4 py-4 text-right">
          <p className="text-xs text-[#8B9995]">تاريخ الطلب</p>
          <p className="mt-2 font-bold text-[var(--primary-color)]">
            {formatDateAndTime(request.preferredDate, request.preferredTime)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex w-full justify-end text-sm text-[#70817C]">
        <div className="ml-auto flex items-center gap-2 text-right" dir="rtl">
          <MapPin size={16} className="shrink-0 text-[#B3E718]" />
          <span>{getLocationLabel(request)}</span>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-[#E4EAE5] bg-[#FCFCFA] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="ml-auto flex items-center gap-3 text-right" dir="rtl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F3A6] text-lg font-bold text-[var(--primary-color)]">
              {getCustomerInitial(request)}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[var(--primary-color)]">
                {getCustomerName(request)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ChatButton requestId={request._id} role="technician" />

            <Button
              className="min-w-[110px] bg-[var(--accent-color)] px-5 py-2 text-sm font-bold text-[var(--primary-color)] hover:bg-[var(--accent-hover)]"
              onClick={async () => {
                if (request.status === "in_progress") {
                  await markRequestOnTheWay(request._id.toString());
                  onRetry();
                  router.push(`/technician/tracking/${request._id}`);
                } else {
                  router.push(`/technician/tracking/${request._id}`);
                }
              }}
            >
              {getPrimaryActionLabel(request.status)}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex w-full justify-end">
          <div
            className="ml-auto flex items-center gap-3 text-right text-sm text-[#6A7A75]"
            dir="rtl"
          >
            {progressBadge ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F1F7E7] px-4 py-2 text-sm font-semibold text-[#5E7D55]">
                <span className="h-2 w-2 rounded-full bg-[#B3E718]" />
                {progressBadge}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <Clock3 size={14} className="text-[#95A4A0]" />
              {formatSince(request.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <CancelRequestModal
          requestId={request._id}
          role="technician"
          serviceName={getPrimaryTitle(request)}
          onClose={() => setShowCancelModal(false)}
          onCancelled={onRetry}
        />
      )}
    </article>
  );
}

interface ActiveServicesSectionProps {
  requests: AssignedRequest[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function ActiveServicesSection({
  requests,
  loading,
  error,
  onRetry,
}: ActiveServicesSectionProps) {
  const activeRequests = useMemo(
    () =>
      requests.filter((request) => ACTIVE_STATUSES.includes(request.status)),
    [requests],
  );

  const awaitingDepositCount = useMemo(
    () => requests.filter((request) => request.status === "accepted").length,
    [requests],
  );

  const awaitingClientCount = useMemo(
    () => requests.filter((request) => request.status === "pending").length,
    [requests],
  );

  return (
    <section className="section-wrapper !max-w-[1220px] !px-0" dir="rtl">
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : activeRequests.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" dir="rtl">
          {activeRequests.map((request) => (
            <ActiveServiceCard
              key={request._id}
              request={request}
              onRetry={onRetry}
            />
          ))}
        </div>
      )}
    </section>
  );
}
