"use client";

import { useState } from "react";
import { MapPin, Calendar, Key, Star } from "lucide-react";
import type { AssignedRequest } from "@/types/request.types";

// ─── Helpers ────────────────────────────────────────────────────────────────────

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getServiceName = (order: AssignedRequest) =>
  order.serviceId?.name ?? order.postId?.title ?? "خدمة بدون عنوان";

const getClientName = (order: AssignedRequest) =>
  order.userId?.fullName ?? "عميل غير معروف";

const getDistrict = (order: AssignedRequest) => {
  const district = order.address?.district;
  const city = order.userId?.city;
  const governorate = order.userId?.governorate;
  if (district && (city || governorate))
    return `${district} — ${city ?? governorate}`;
  return district ?? city ?? governorate ?? "غير متاح";
};

const getFullAddress = (order: AssignedRequest) =>
  order.address?.fullAddress ?? null;

const getPrice = (order: AssignedRequest): string => {
  if (typeof order.totalPrice === "number" && order.totalPrice > 0)
    return String(order.totalPrice);
  const min = order.serviceId?.priceRange?.min;
  const max = order.serviceId?.priceRange?.max;
  if (typeof min === "number" && typeof max === "number")
    return `${min}–${max}`;
  if (typeof order.postId?.acceptedProposal?.price === "number")
    return String(order.postId.acceptedProposal.price);
  return "—";
};

const getRequestId = (order: AssignedRequest) => {
  const raw = order.requestId ?? order._id ?? "";
  return `SRV-${String(raw).slice(-4).toUpperCase()}`;
};

const getRating = (order: AssignedRequest): number =>
  (order as AssignedRequest & { rating?: number }).rating ?? 4.0;

// ─── Types ───────────────────────────────────────────────────────────────────────

type Tab = "all" | "completed" | "cancelled" | "active";

// ─── Filter Tabs ─────────────────────────────────────────────────────────────────

function FilterTabs({
  active,
  counts,
  onChange,
}: {
  active: Tab;
  counts: { all: number; completed: number; cancelled: number; active: number };
  onChange: (tab: Tab) => void;
}) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "جميع الخدمات" },
    { key: "active", label: "النشطة" },
    { key: "completed", label: "المكتملة" },
    { key: "cancelled", label: "الملغية" },
  ];

  return (
    <div className="flex items-center gap-2 mb-8 flex-wrap" dir="rtl">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
            active === key
              ? "bg-[var(--primary-color)] text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
          }`}
        >
          {label}
          <span
            className={`text-xs w-5 h-5 flex items-center justify-center rounded-full ${
              active === key
                ? "bg-[var(--accent-color)] text-[var(--primary-color)]"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === "completed")
    return (
      <span className="flex items-center gap-1.5 bg-[var(--secondary-color)] text-[var(--primary-color)] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)] inline-block" />
        مكتملة
      </span>
    );
  if (status === "cancelled")
    return (
      <span className="flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
        ملغية
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 bg-[#E6F3A6] text-[#31554B] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-[#B3E718] inline-block animate-pulse" />
      نشطة
    </span>
  );
}

// ─── Star Rating ─────────────────────────────────────────────────────────────────

export function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const total = 5;
  return (
    <div className="flex items-center gap-1 mt-1 " dir="ltr">
      {Array.from({ length: total }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < full
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
      <span className="text-xs text-gray-500 font-medium mr-0.5">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────────

function ServiceCard({ order }: { order: AssignedRequest }) {
  const price = getPrice(order);
  const rating = getRating(order);
  const district = getDistrict(order);
  const fullAddress = getFullAddress(order);

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4"
      dir="rtl"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
        <Key size={17} />
      </div>
      {/* ── Right: service info ── */}
      <div className="flex-shrink-0 min-w-[160px] text-right" dir="ltr">
        <div className="flex items-center gap-2 mb-1.5">
          <StatusBadge status={order.status} />
          <span className="text-xs text-gray-400 font-mono">
            {getRequestId(order)}
          </span>
        </div>
        <h3 className="font-bold text-[var(--primary-color)] text-base leading-snug">
          {getServiceName(order)}
        </h3>
        <div
          className="flex items-center gap-1 mt-1.5 text-gray-400 text-xs"
          dir="rtl"
        >
          <Calendar size={12} />
          <span>{formatDate(order.createdAt)}</span>
        </div>
      </div>

      {/* ── Key icon button ── */}

      {/* ── Center: client info ── */}
      <div className="flex-1 min-w-0 flex items-center gap-3" dir="ltr">
        {/* Client text */}
        <div className="flex-1 min-w-0 text-right">
          <p className="font-bold text-sm text-gray-800 truncate">
            {getClientName(order)}
          </p>
          <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-xs justify-end">
            <span className="truncate">{district}</span>
            <MapPin size={12} className="flex-shrink-0" />
          </div>
          {fullAddress && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {fullAddress}
            </p>
          )}
        </div>
        {/* Avatar */}
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
      </div>

      {/* ── Left: price + rating ── */}
      <div className="flex-shrink-0 text-left pl-2 border-r border-gray-100 pr-4">
        <p className="text-xs text-gray-400 font-medium text-right">السعر</p>
        <p className="font-bold text-[var(--primary-color)] text-lg leading-tight text-right">
          <span className="text-xs font-semibold text-gray-500 ml-0.5">
            EGP
          </span>{" "}
          {price}
        </p>
        <StarRating rating={rating} />
      </div>
    </div>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 animate-pulse">
      <div className="flex-shrink-0 min-w-[160px] space-y-2">
        <div className="h-6 w-24 bg-gray-100 rounded-full" />
        <div className="h-4 w-36 bg-gray-100 rounded" />
        <div className="h-3 w-28 bg-gray-100 rounded" />
      </div>
      <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 bg-gray-100 rounded ml-auto" />
          <div className="h-3 w-20 bg-gray-100 rounded ml-auto" />
          <div className="h-3 w-40 bg-gray-100 rounded ml-auto" />
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
      </div>
      <div className="flex-shrink-0 pl-2 border-r border-gray-100 pr-4 space-y-1.5">
        <div className="h-3 w-10 bg-gray-100 rounded ml-auto" />
        <div className="h-6 w-16 bg-gray-100 rounded" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-[28px] border border-dashed border-[#DCE4E1] bg-[#FBFCFB] p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F7E7] text-[var(--primary-color)] mb-4">
          <Key size={26} />
        </div>
        <h3 className="text-xl font-bold text-[var(--primary-color)]">
          لا توجد خدمات في هذا القسم
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#6B7A76]">
          ستظهر هنا جميع الخدمات التي قمت بتنفيذها عند توفرها.
        </p>
      </div>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────────

interface Props {
  orders: AssignedRequest[];
  loading?: boolean;
}

export default function ServicesHistorySection({
  orders,
  loading = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const completedCount = orders.filter((o) => o.status === "completed").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const activeCount = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled",
  ).length;

  const filtered =
    activeTab === "all"
      ? orders
      : activeTab === "active"
        ? orders.filter(
            (o) => o.status !== "completed" && o.status !== "cancelled",
          )
        : orders.filter((o) => o.status === activeTab);

  return (
    <div className="section-wrapper !max-w-[1220px]" dir="rtl">
      <FilterTabs
        active={activeTab}
        counts={{
          all: orders.length,
          completed: completedCount,
          cancelled: cancelledCount,
          active: activeCount,
        }}
        onChange={setActiveTab}
      />

      <div className="flex flex-col gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((order) => <ServiceCard key={order._id} order={order} />)
        )}
      </div>
    </div>
  );
}
