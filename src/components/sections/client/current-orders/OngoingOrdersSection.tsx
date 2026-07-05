"use client";

import ActiveOrderCard from "./ActiveOrderCard";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { Post } from "@/types/post.types";
import PostCard from "./PostCard";

export interface Order {
  _id: string;
  status:
    | "pending"
    | "accepted"
    | "in_progress"
    | "on_the_way"
    | "started"
    | "completed"
    | "cancelled";
  preferredDate: string;
  preferredTime: string;
  createdAt: string;
  updatedAt: string;
  depositAmount: number;
  depositStatus: "paid" | "unpaid" | "pending";
  totalPrice: number;
  isFullyPaid: boolean;
  notes: string;
  address: {
    fullAddress: string;
    district: string;
    coordinates?: { lat: number; lng: number };
  };
  categoryId: { _id: string; name: string; image?: string };
  serviceId: {
    _id: string;
    name: string;
    image?: string;
    priceRange?: { min: number; max: number };
  };
  assignedTechnician?: {
    _id: string;
    fullName: string;
    phone: string;
    averageRating?: number;
    yearsOfExperience?: number;
    specialization?: { categoryId: string };
    totalReviews?: number;
    verificationStatus?: string;
  };
  clientReview?: { rating: number; comment?: string } | null;
  review?: {
    rating: number;
  } | null;
  postId?: {
    _id: string;
    title?: string;
    image?: string;
  };
}

const STATUS_CONFIG = {
  pending: { label: "قيد الانتظار", className: "bg-amber-100 text-amber-700" },
  accepted: {
    label: "تمت المطابقة",
    className: "bg-[var(--accent-color)] text-[var(--primary-color)]",
  },
  in_progress: {
    label: "تم الدفع",
    className: "bg-[var(--accent-color)] text-[var(--primary-color)]",
  },
  on_the_way: {
    label: "الفني في الطريق",
    className: "bg-[var(--secondary-color)] text-[var(--primary-color)]",
  },
  started: {
    label: "العمل جار",
    className: "bg-[var(--secondary-color)] text-[var(--primary-color)]",
  },
  completed: { label: "مكتملة", className: "bg-gray-100 text-gray-500" },
  cancelled: { label: "ملغية", className: "bg-red-100 text-red-600" },
} as const;

export function getClientOrderStatusBadge(order: Order) {
  if (order.status === "accepted" && order.depositStatus === "pending")
    return {
      label: "جاري تأكيد الدفع",
      className: "bg-amber-100 text-amber-700",
    };
  if (order.status === "accepted" && order.depositStatus === "unpaid")
    return {
      label: "بانتظار دفع العربون",
      className: "bg-[var(--accent-color)] text-[var(--primary-color)]",
    };
  return STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
  });

const formatTime = (timeStr: string): string => {
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr);
  const m = mStr ?? "00";
  const label = h < 12 ? "صباحاً" : "مساءً";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${label}`;
};

function StatusBadge({ order }: { order: Order }) {
  const cfg = getClientOrderStatusBadge(order);
  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function OrderMeta({ order }: { order: Order }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-[#F8FAF9] rounded-xl p-2">
        <p className="text-xs text-gray-400 mb-1">نطاق السعر</p>
        {order.serviceId?.priceRange ? (
          <p className="font-bold text-[var(--primary-color)] text-sm">
            {order.serviceId.priceRange.min} - {order.serviceId.priceRange.max}{" "}
            <span className="font-normal text-xs">جنية</span>
          </p>
        ) : (
          <p className="text-xs text-gray-400">—</p>
        )}
      </div>
      <div className="bg-[#F8FAF9] rounded-xl p-2">
        <p className="text-xs text-gray-400 mb-1">تاريخ الطلب</p>
        <div className="flex justify-between items-center gap-1">
          <span className="font-bold text-[var(--primary-color)] text-sm">
            {formatDate(order.preferredDate)}
          </span>
          <span className="text-xs text-gray-400">
            {formatTime(order.preferredTime)}
          </span>
        </div>
      </div>
    </div>
  );
}

function PendingOrderCard({ order }: { order: Order }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-white" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-[var(--primary-color)] text-base">
            {order.serviceId?.name}
          </h3>
          {order.categoryId?.name && (
            <span className="text-xs text-gray-400">
              {order.categoryId.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge order={order} />
          <button className="text-gray-300 hover:text-gray-500">⋮</button>
        </div>
      </div>
      <OrderMeta order={order} />
      {order.address?.fullAddress && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin size={12} className="text-[var(--accent-color)]" />
          <span>{order.address.fullAddress}</span>
        </div>
      )}
      <div className="bg-[var(--secondary-color)] rounded-xl px-4 py-3 text-center">
        <p className="text-xs text-[var(--primary-color)] font-medium">
          جاري البحث عن الفنيين المناسبين ...
        </p>
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  orders: Order[];
  openPosts?: Post[];
  onCancelled?: () => void;
}

type Tab = "all" | "fixed" | "other";

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

function FilterTabs({
  active,
  counts,
  onChange,
}: {
  active: Tab;
  counts: { all: number; fixed: number; other: number };
  onChange: (tab: Tab) => void;
}) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "الكل" },
    { key: "other", label: "الخدمات المخصصة" },
    { key: "fixed", label: "الخدمات الثابتة" },
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OngoingOrdersSection({
  orders,
  openPosts = [],
  onCancelled,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  // الطلبات الجارية فقط (مش مكتملة أو ملغية)
  const ongoingOrders = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled",
  );

  // ثابتة = عندها serviceId
  const fixedOrders = ongoingOrders.filter((o) => !!o.serviceId);

  // مخصصة = orders بدون serviceId + openPosts
  const otherOrders = ongoingOrders.filter((o) => !o.serviceId);

  // الـ posts تظهر في "الكل" و"المخصصة" بس مش في "الثابتة"
  const showPosts = activeTab === "all" || activeTab === "other";

  const filteredOrders =
    activeTab === "all"
      ? ongoingOrders
      : activeTab === "fixed"
        ? fixedOrders
        : otherOrders;

  // عدد العناصر الكلي اللي هيتعرض (orders + posts لو مناسب)
  const visibleCount =
    filteredOrders.length + (showPosts ? openPosts.length : 0);

  return (
    <div className="section-wrapper">
      <h2 className="text-xl font-bold text-[var(--primary-color)] mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-[var(--primary-color)] rounded-full inline-block" />
        الطلبات الجارية
      </h2>

      <FilterTabs
        active={activeTab}
        counts={{
          all: ongoingOrders.length + openPosts.length,
          fixed: fixedOrders.length,
          other: otherOrders.length + openPosts.length,
        }}
        onChange={setActiveTab}
      />

      {visibleCount === 0 ? (
        <p className="text-gray-400 text-sm text-center py-10">
          لا توجد طلبات جارية
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* البوستات المخصصة - تظهر في الكل والمخصصة */}
          {showPosts &&
            openPosts.map((post) => <PostCard key={post._id} post={post} />)}

          {/* الطلبات */}
          {filteredOrders.map((order) =>
            order.status === "pending" ? (
              <PendingOrderCard key={order._id} order={order} />
            ) : (
              <ActiveOrderCard
                key={order._id}
                order={order}
                onCancelled={onCancelled}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
