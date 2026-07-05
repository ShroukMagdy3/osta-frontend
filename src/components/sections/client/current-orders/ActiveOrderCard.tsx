"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import DepositModal from "./DepositModal";
import { Order } from "./OngoingOrdersSection";
import ChatButton from "../direct-messages/ChatButton";
import RequestOptionsMenu from "../../shared/RequestOptionsMenu";
import CancelRequestModal from "../../shared/CancelRequestModal";

const formatTime = (timeStr: string): string => {
  const clean = timeStr.replace(/\s*(AM|PM)\s*/i, "").trim();
  const [hStr, mStr] = clean.split(":");
  let h = parseInt(hStr);
  const m = mStr ?? "00";
  const label = h >= 12 ? "مساءً" : "صباحاً";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${label}`;
};

export default function ActiveOrderCard({
  order,
  onCancelled,
}: {
  order: Order;
  onCancelled?: () => void;
}) {
  const router = useRouter();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const technicianInitial =
    order.assignedTechnician?.fullName?.charAt(0) ?? "?";
  const canPayDeposit =
    order.status === "accepted" && order.depositStatus === "unpaid";
  const canTrackOrder =
    order.status === "in_progress" ||
    order.status === "on_the_way" ||
    order.status === "started";

  return (
    <>
      <div
        className="border-2 border-[var(--accent-color)] rounded-2xl p-5 bg-white"
        dir="rtl"
      >
        {/* ── Header ── */}
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
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--accent-color)] text-[var(--primary-color)]">
              {order.status === "in_progress" ? "تم الدفع" : "تمت المطابقة"}
            </span>
            <RequestOptionsMenu
              status={order.status}
              onCancelClick={() => setShowCancelModal(true)}
            />
          </div>
        </div>

        {/* ── Meta ── */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-[#F8FAF9] rounded-xl p-2">
            <p className="text-xs text-gray-400 mb-1">نطاق السعر</p>
            {order.serviceId?.priceRange ? (
              <p className="font-bold text-[var(--primary-color)] text-sm">
                {order.serviceId.priceRange.min} -{" "}
                {order.serviceId.priceRange.max}{" "}
                <span className="font-normal text-xs">جنية</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400">—</p>
            )}
          </div>
          <div className="bg-[#F8FAF9] rounded-xl p-2">
            <p className="text-xs text-gray-400 mb-1">تاريخ الطلب</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[var(--primary-color)] text-sm">
                {new Date(order.preferredDate).toLocaleDateString("ar-EG", {
                  day: "numeric",
                  month: "long",
                })}
              </span>

              <span className="text-xs text-gray-400">
                {formatTime(order.preferredTime)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Technician section ── */}
        <div className="bg-[#F8FAF9] rounded-xl p-3">
          {/* Technician row */}
          <div className="flex items-center justify-between mb-3">
            {/* Technician info + avatar */}
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#D9F06A] flex items-center justify-center text-[var(--primary-color)] text-sm font-bold shrink-0">
                {technicianInitial}
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-[var(--primary-color)]">
                  {order.assignedTechnician?.fullName ?? "—"}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[var(--primary-color)]">
                    {order.assignedTechnician?.averageRating ?? "0"}
                  </span>
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-400">
                    ({order.assignedTechnician?.totalReviews ?? 0})
                  </span>
                </div>
              </div>
            </div>

            {/* Chat icon */}
            <ChatButton requestId={order._id} role="client" />

            {/* CTA button */}
            {order.status === "in_progress" ? (
              <button
                onClick={() => router.push(`/client/tracking/${order._id}`)}
                className="bg-[var(--accent-color)] text-[var(--primary-color)] text-xs font-bold px-4 py-2.5 rounded-full hover:opacity-90 transition-all"
              >
                تتبع الطلب
              </button>
            ) : canPayDeposit ? (
              <button
                onClick={() => setShowDepositModal(true)}
                className="bg-[var(--accent-color)] text-[var(--primary-color)] text-xs font-bold px-4 py-2.5 rounded-full hover:opacity-90 transition-all"
              >
                ادفع العربون
              </button>
            ) : canTrackOrder ? (
              <button
                onClick={() => router.push(`/client/tracking/${order._id}`)}
                className="bg-[var(--accent-color)] text-[var(--primary-color)] text-xs font-bold px-4 py-2.5 rounded-full whitespace-nowrap hover:opacity-90 transition-all"
              >
                تتبع الطلب
              </button>
            ) : (
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {order.depositStatus === "pending"
                  ? "جاري تأكيد الدفع"
                  : "تم دفع العربون"}
              </span>
            )}
          </div>

          {/* Experience note */}
          <p className="text-xs text-gray-500 text-right">
            خبرة {order.assignedTechnician?.yearsOfExperience ?? "0"} سنوات في
            خدمة ال{order.categoryId.name}
          </p>
        </div>
      </div>

      {showDepositModal && (
        <DepositModal
          requestId={order._id}
          serviceName={order.serviceId?.name ?? ""}
          categoryName={order.categoryId?.name ?? ""}
          technicianName={order.assignedTechnician?.fullName ?? "—"}
          technicianRating={order.assignedTechnician?.averageRating}
          priceMin={order.serviceId?.priceRange?.min}
          priceMax={order.serviceId?.priceRange?.max}
          depositAmount={order.depositAmount}
          onClose={() => setShowDepositModal(false)}
        />
      )}

      {showCancelModal && (
        <CancelRequestModal
          requestId={order._id}
          role="client"
          serviceName={order.serviceId?.name}
          onClose={() => setShowCancelModal(false)}
          onCancelled={() => onCancelled?.()}
        />
      )}
    </>
  );
}
