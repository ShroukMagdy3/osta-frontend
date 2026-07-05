"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { api } from "@/api/axios";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userId: { fullName: string } | null;
  serviceId: { name: string } | null;
  createdAt: string;
}

interface ReviewsSectionProps {
  technicianId: string;
  averageRating: number;
  totalReviews: number;
}

// ─── Stars row ────────────────────────────────────────────────────────────────

function StarRow({ rating, filled }: { rating: number; filled: boolean }) {
  return (
    <Star
      size={16}
      className={filled ? "text-yellow-400" : "text-gray-200"}
      fill={filled ? "#FACC15" : "#E5E7EB"}
    />
  );
}

function StarsDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarRow key={s} rating={s} filled={s <= Math.round(rating)} />
      ))}
    </div>
  );
}

// ─── Rating bar row ───────────────────────────────────────────────────────────

function RatingBar({ star, percent }: { star: number; percent: number }) {
  return (
    <div className="flex items-center gap-3" dir="ltr">
      <span className="w-6 text-left text-xs text-gray-400">{percent}%</span>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent-color)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center gap-0.5">
        <Star size={12} fill="#FACC15" className="text-yellow-400" />
        <span className="text-xs text-gray-400">{star}</span>
      </div>
    </div>
  );
}

// ─── Review card ─────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const initials =
    review.userId?.fullName
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("") ?? "؟";

  return (
    <div
      dir="rtl"
      className="flex flex-col gap-3 rounded-[20px] border border-[#EAECE8] bg-white p-5"
    >
      {/* Service tag */}
      {review.serviceId?.name && (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-[var(--secondary-color)] px-3 py-1 text-xs font-medium text-[var(--primary-color)]">
          🔧 {review.serviceId.name}
        </span>
      )}

      {/* Quote mark + comment */}
      <div className="relative">
        <span className="absolute -top-8 -left-1 text-4xl leading-none text-[var(--accent-color)] font-bold opacity-25 pointer-events-none font-serif select-none">
          “
        </span>
        <p className="pt-4 text-sm leading-relaxed text-gray-600">
          {review.comment}
        </p>
      </div>

      {/* Client info */}
      <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--secondary-color)] text-xs font-bold text-[var(--primary-color)]">
          {initials}
        </div>
        <span className="text-sm font-bold text-[#112D27]">
          {review.userId?.fullName ?? "عميل"}
        </span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ReviewsSection({
  technicianId,
  averageRating,
  totalReviews,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!technicianId) return;
    api
      .get(`/reviews/technician/${technicianId}`)
      .then((res) => setReviews(res.data?.data ?? []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [technicianId]);

  // Build rating distribution from fetched reviews
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percent =
      reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { star, percent };
  });

  return (
    <div dir="rtl" className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-start  gap-3 rounded-[24px] border border-[#EAECE8] bg-white px-6 py-5 shadow-sm">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--secondary-color)]">
          <Star size={16} className="text-[var(--primary-color)]" />
        </div>
        <div className="text-right">
          <h2 className="text-base font-bold text-[#112D27]">التقييمات</h2>
          <p className="mt-1 text-xs text-gray-400">
            آراء العملاء حول خدماتك على منصة أسطى
          </p>
        </div>
      </div>

      {/* Rating summary card */}
      <div
        className="rounded-[20px] border border-[#EAECE8] bg-white p-6 shadow-sm"
        dir="ltr"
      >
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary-color)] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto]">
            {/* Rating bars */}
            <div className="flex flex-col gap-2.5">
              {distribution.map((d) => (
                <RatingBar key={d.star} star={d.star} percent={d.percent} />
              ))}
            </div>

            {/* Score block */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[var(--secondary-color)] px-8 py-5 text-center">
              <span className="text-5xl font-black text-[var(--primary-color)]">
                {averageRating.toFixed(1)}
              </span>
              <StarsDisplay rating={averageRating} />
              <span className="text-xs text-gray-400">
                بناءً على {totalReviews} تقييم
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Review cards */}
      {!loading && reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#EAECE8] bg-white py-12 text-center shadow-sm">
          <Star size={32} className="mb-3 text-gray-200" />
          <p className="text-sm text-gray-400">لا توجد تقييمات حتى الآن</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => {
            if (review.comment)
              return <ReviewCard key={review._id} review={review} />;
            return null;
          })}
        </div>
      )}
    </div>
  );
}
