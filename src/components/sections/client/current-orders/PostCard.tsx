"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Post, Proposal } from "@/types/post.types";
import Image from "next/image";
import purp_icon from "@/assets/icons/purp_icon.svg";
import { api } from "@/api/axios";
import { StarRating } from "../../technician/profile/ServicesHistorySection";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
  });

const formatTime = (timeStr: string): string => {
  // شيل AM/PM لو موجودين
  const clean = timeStr.replace(/\s*(AM|PM)\s*/i, "").trim();
  const [hStr, mStr] = clean.split(":");
  let h = parseInt(hStr);
  const m = mStr ?? "00";
  const label = h >= 12 ? "مساءً" : "صباحاً";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${label}`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetaGrid({
  date,
  time,
  price,
}: {
  date: string;
  time: string;
  price?: number | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {/* تاريخ الطلب */}
      <div className="bg-[#F8FAF9] rounded-xl p-2">
        <p className="text-xs text-gray-400 mb-1">تاريخ الطلب</p>
        <div className="flex justify-between items-center gap-1">
          <span className="font-bold text-[var(--primary-color)] text-sm">
            {formatDate(date)}
          </span>
          <span className="text-xs text-gray-400">{formatTime(time)}</span>
        </div>
      </div>

      {/* الميزانية */}
      <div className="bg-[#F8FAF9] rounded-xl p-2">
        <p className="text-xs text-gray-400 mb-1">الميزانية المقترحة</p>
        {price != null ? (
          <p className="font-bold text-[var(--primary-color)] text-sm">
            {price} <span className="font-normal text-xs">جنيه</span>
          </p>
        ) : (
          <p className="text-xs text-gray-400">—</p>
        )}
      </div>
    </div>
  );
}

// سيناريو 1: جاري البحث
function SearchingState() {
  return (
    <div className="bg-[var(--purple-light)] rounded-xl px-4 py-3 text-center">
      <p className="text-xs text-[var(--primary-color)] font-medium">
        جار البحث عن فني مناسب لطلبك...
      </p>
    </div>
  );
}

// سيناريو 2: في عروض → زرار بعدد العروض
function ProposalsState({
  count,
  onNavigate,
}: {
  count: number;
  onNavigate: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onNavigate();
      }}
      className="w-full py-2.5 rounded-xl bg-[var(--purple-light)] text-[var(--purple-dark)] text-sm font-bold flex items-center justify-center gap-2"
    >
      الذهاب لعروض الفنيين
      <span>←</span>
      <span className="bg-[var(--purple-dark)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {count}
      </span>
    </button>
  );
}

// سيناريو 3: تم اختيار فني
function AcceptedTechnicianState({ proposal }: { proposal: Proposal }) {
  const tech =
    typeof proposal.technician === "object" ? proposal.technician : null;

  return (
    <div className="border border-[var(--purple-dark)] rounded-xl p-3 flex items-center justify-between gap-3">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white text-sm font-bold shrink-0">
        {tech?.fullName?.charAt(0) ?? "ف"}
      </div>

      {/* Info */}
      <div className="flex-1 text-right">
        <p className="font-bold text-[var(--primary-color)] text-sm">
          {tech?.fullName ?? "—"}
        </p>
        {tech?.yearsOfExperience && (
          <p className="text-xs text-gray-400">
            خبرة {tech.yearsOfExperience} سنوات
          </p>
        )}
        {tech?.averageRating != null && (
          <StarRating rating={tech.averageRating} />
        )}
      </div>

      {/* Price chip */}
      <div className="text-center shrink-0">
        <p className="font-bold text-[var(--primary-color)] text-sm">
          {proposal.price} <span className="font-normal text-xs">جنيه</span>
        </p>
        {proposal.estimatedTime && (
          <p className="text-xs text-gray-400">{proposal.estimatedTime}</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/posts/${post._id}/proposals`)
      .then((res) => {
        if (!cancelled) {
          // الـ proposals جوه res.data.data.proposals
          const proposals: Proposal[] =
            res.data?.data?.proposals ?? res.data?.data ?? [];
          setProposals(Array.isArray(proposals) ? proposals : []);
        }
      })
      .catch(() => {
        if (!cancelled) setProposals([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingProposals(false);
      });
    return () => {
      cancelled = true;
    };
  }, [post._id]);

  const navigate = () => router.push(`/client/posts/${post._id}`);

  // الـ accepted proposal
  const acceptedProposal =
    typeof post.acceptedProposal === "object" && post.acceptedProposal !== null
      ? (post.acceptedProposal as Proposal)
      : (proposals.find((p) => p.status === "accepted") ?? null);

  // حالة العرض
  const hasAccepted = !!acceptedProposal;

  const safeProposals = Array.isArray(proposals) ? proposals : [];
  const pendingCount = safeProposals.filter(
    (p) => p.status === "pending",
  ).length;
  const hasProposals = pendingCount > 0;

  return (
    <div
      className="border border-[var(--purple-dark)] rounded-2xl p-5 bg-white cursor-pointer hover:border-[var(--purple-light)] transition-all"
      dir="rtl"
      onClick={navigate}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-right">
          <h3 className="font-bold text-[var(--primary-color)] text-base">
            {post.title ?? post.categoryId?.name}
          </h3>
          <span className="text-xs text-gray-400">{post.categoryId?.name}</span>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full text-[var(--purple-dark)] bg-[var(--purple-light)]">
          خدمة مخصصة
        </span>
      </div>

      {/* ── Description ── */}
      <div className="bg-[#F8FAF9] rounded-xl px-3 py-2 mb-3">
        <p className="text-xs text-[var(--purple-dark)] mb-1 flex items-center gap-1">
          <Image src={purp_icon} alt="problem" width={14} height={14} />
          وصف المشكلة
        </p>
        <p className="text-sm text-gray-600 text-right line-clamp-2">
          {post.description}
        </p>
      </div>

      {/* ── Meta: date + price ── */}
      <MetaGrid
        date={post.preferredDate}
        time={post.preferredTime}
        price={post.budget}
      />

      {/* ── CTA: 3 سيناريوهات ── */}
      {loadingProposals ? (
        <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
      ) : hasAccepted ? (
        <AcceptedTechnicianState proposal={acceptedProposal!} />
      ) : hasProposals ? (
        <ProposalsState count={pendingCount} onNavigate={navigate} />
      ) : (
        <SearchingState />
      )}
    </div>
  );
}
