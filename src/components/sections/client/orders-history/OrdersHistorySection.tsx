"use client";

import { useState } from "react";
import { Star, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { AssignedRequest } from "@/types/request.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ─── Active Order Banner ───────────────────────────────────────────────────────

function ActiveOrderBanner({ order }: { order: AssignedRequest }) {
  const serviceName =
    order.serviceId?.name ?? order.postId?.title ?? "طلب جارٍ";
  const categoryName = (order as unknown as { categoryId?: { name?: string } })
    .categoryId?.name;

  return (
    <Link href={`/client/tracking/${order._id}`}>
      <div
        className="bg-[var(--secondary-color)] rounded-2xl px-6 py-4 flex items-center justify-between mb-8 cursor-pointer hover:opacity-90 transition-opacity"
        dir="rtl"
      >
        <span className="bg-[var(--accent-color)] text-[var(--primary-color)] text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--primary-color)] inline-block animate-pulse" />
          يوجد طلب جار الآن
        </span>
        <div className="text-right">
          <p className="font-bold text-[var(--primary-color)] text-base">
            {serviceName}
          </p>
          {categoryName && (
            <p className="text-xs text-gray-500">{categoryName}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[var(--primary-color)]">
            اضغط للمتابعة
          </span>
          <ArrowLeft size={18} className="text-[var(--primary-color)]" />
        </div>
      </div>
    </Link>
  );
}

// ─── Filter Tabs ───────────────────────────────────────────────────────────────

type Tab = "all" | "cancelled" | "completed";

function FilterTabs({
  active,
  counts,
  onChange,
}: {
  active: Tab;
  counts: { all: number; cancelled: number; completed: number };
  onChange: (tab: Tab) => void;
}) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "جميع الطلبات" },
    { key: "cancelled", label: "الملغية" },
    { key: "completed", label: "المكتملة" },
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

// ─── History Card ──────────────────────────────────────────────────────────────

function HistoryOrderCard({ order }: { order: AssignedRequest }) {
  const isCompleted = order.status === "completed";
  const isCancelled = order.status === "cancelled";
  const categoryData = (
    order as unknown as { categoryId?: { name?: string; image?: string } }
  ).categoryId;
  const serviceImage =
    order.serviceId?.image ||
    order.postId?.image ||
    categoryData?.image ||
    "/images/placeholder.png";
  const serviceName = order.serviceId?.name || order.postId?.title || "—";
  const categoryName = categoryData?.name;
  const technicianName = order.assignedTechnician?.fullName || null;
  const clientRating = order.review?.rating || null;

  // صورة الخدمة من serviceId.image

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4"
      dir="rtl"
    >
      {/* Content */}
      <div className="flex-1 text-right">
        {/* Title + status badge */}
        <div className="flex items-start justify-between mb-1 gap-2">
          <h4 className="font-bold text-[var(--primary-color)] text-base leading-tight">
            {serviceName}
          </h4>
          {isCompleted && (
            <span className="flex items-center gap-1 bg-[var(--secondary-color)] text-[var(--primary-color)] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
              <CheckCircle size={12} />
              مكتمل
            </span>
          )}
          {isCancelled && (
            <span className="flex items-center gap-1 bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
              <XCircle size={12} />
              ملغي
            </span>
          )}
        </div>

        {categoryName && (
          <p className="text-xs text-gray-400 mb-2">{categoryName}</p>
        )}

        <p className="text-xs text-gray-400 mb-3">
          {formatDate(order.createdAt)}
        </p>

        {/* Cost */}
        {isCompleted && order.totalPrice ? (
          <div className="mb-3">
            <p className="text-xs text-gray-400 ">التكلفة النهائية</p>
            <p className="font-bold text-[var(--primary-color)] text-lg">
              {order.totalPrice}{" "}
              <span className="text-sm font-normal">جنية</span>
            </p>
          </div>
        ) : isCancelled && order.serviceId?.priceRange ? (
          <div className="mb-3">
            <p className="text-xs text-gray-400">نطاق السعر</p>
            <p className="font-bold text-[var(--primary-color)] text-sm">
              {order.serviceId.priceRange.min} –{" "}
              {order.serviceId.priceRange.max}{" "}
              <span className="font-normal text-xs">جنية</span>
            </p>
          </div>
        ) : null}

        {/* Technician for completed */}
        {isCompleted && technicianName && (
          <div className="flex items-center justify-start gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-[var(--secondary-color)] flex items-center justify-center text-[var(--primary-color)] text-xs font-bold flex-shrink-0">
              {technicianName.charAt(0)}
            </div>
            <span className="text-xs text-gray-400"> الفني:</span>
            <p className="font-bold text-sm text-[var(--primary-color)]">
              {technicianName}
            </p>
          </div>
        )}

        {/* Cancelled note */}
        {isCancelled && order.cancellation?.reason && (
          <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
            <XCircle size={12} className="text-red-400" />
            {order.cancellation.reason}
          </p>
        )}

        {/* Stars placeholder — backend doesn't store client rating yet */}
        {isCompleted && (
          <div className="flex items-center gap-1 justify-end mt-2">
            <span className="text-xs text-gray-400 ml-1">تقييمك</span>
            {clientRating !== null ? (
              [1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= Math.round(clientRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }
                />
              ))
            ) : (
              <Link
                href={`/client/orders`}
                className="text-xs text-[var(--primary-color)] font-bold underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                قيّم الآن
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Image */}
      <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
        {serviceImage ? (
          <Image
            src={serviceImage}
            alt={serviceName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-300 text-xs">صورة الخدمة</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 animate-pulse">
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4 ml-auto" />
        <div className="h-3 bg-gray-100 rounded w-1/2 ml-auto" />
        <div className="h-3 bg-gray-100 rounded w-1/3 ml-auto" />
        <div className="h-5 bg-gray-100 rounded w-1/4 ml-auto" />
      </div>
      <div className="w-28 h-28 bg-gray-100 rounded-xl flex-shrink-0" />
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface Props {
  orders: AssignedRequest[];
  loading?: boolean;
}

export default function OrdersHistorySection({
  orders,
  loading = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const activeOrder = orders.find(
    (o) => o.status !== "completed" && o.status !== "cancelled",
  );

  const historyOrders = orders.filter(
    (o) => o.status === "completed" || o.status === "cancelled",
  );

  const completedCount = historyOrders.filter(
    (o) => o.status === "completed",
  ).length;
  const cancelledCount = historyOrders.filter(
    (o) => o.status === "cancelled",
  ).length;

  const filtered =
    activeTab === "all"
      ? historyOrders
      : historyOrders.filter((o) => o.status === activeTab);

  return (
    <div className="section-wrapper" dir="rtl">
      {/* Active order banner */}
      {!loading && activeOrder && <ActiveOrderBanner order={activeOrder} />}

      {/* Filter tabs */}
      <FilterTabs
        active={activeTab}
        counts={{
          all: historyOrders.length,
          cancelled: cancelledCount,
          completed: completedCount,
        }}
        onChange={setActiveTab}
      />

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-16">
          لا توجد طلبات في هذا القسم
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((order) => (
            <HistoryOrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
