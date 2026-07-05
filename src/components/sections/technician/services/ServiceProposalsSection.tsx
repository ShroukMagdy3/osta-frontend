"use client";

import { Clock, Star } from "lucide-react";

export interface Proposal {
  _id: string;
  estimatedTime?: string;
  description?: string;
  price?: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  isMyProposal: boolean;
  technician: {
    _id: string;
    fullName: string;
    averageRating?: number;
    totalReviews?: number;
  } | null;
}

const formatTimeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.floor(hours / 24)} يوم`;
};

const STATUS_STYLES = {
  pending:  { label: "قيد الانتظار", className: "bg-amber-100 text-amber-700" },
  accepted: { label: "مقبول",        className: "bg-[var(--accent-color)] text-[var(--primary-color)]" },
  rejected: { label: "مرفوض",        className: "bg-red-100 text-red-600" },
} as const;

function ProposalRow({ proposal }: { proposal: Proposal }) {
  const tech = proposal.technician;
  const name = tech?.fullName ?? "فني";
  const initial = name.charAt(0);
  const statusStyle = STATUS_STYLES[proposal.status];

  return (
    <div className="py-4 border-b border-gray-100 last:border-0" dir="rtl">
      <div className="flex items-start justify-between gap-3">
        {/* Avatar + info */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-bold shrink-0">
            {initial}
          </div>
          <div className="flex-1 text-right">
            <div className="flex items-center  gap-2 mb-1">
              <p className="font-bold text-[var(--primary-color)] text-sm">{name}</p>
            </div>
            <div>
                {tech?.averageRating != null && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  ({tech.totalReviews ?? 0})
                  <span className="font-bold text-[var(--primary-color)]">
                    {tech.averageRating}
                  </span>
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                </span>
              )}
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={11} />
                {formatTimeAgo(proposal.createdAt)}
              </span>

            </div>
            {proposal.description && (
              <p className="text-sm text-gray-500 leading-relaxed">{proposal.description}</p>
            )}
          </div>
        </div>
      </div>

      {proposal.isMyProposal && (
        <div className="mt-2 flex justify-end">
          <span className="text-xs bg-[var(--secondary-color)] text-[var(--primary-color)] font-bold px-3 py-1 rounded-full">
            عرضك
          </span>
        </div>
      )}
    </div>
  );
}

export default function ServiceProposalsSection({
  proposals,
  postId,
  postStatus,
}: {
  proposals: Proposal[];
  postId: string;
  postStatus: string;
}) {
  return (
    <div className="section-wrapper" dir="rtl">
      <h2 className="text-xl font-bold text-[var(--primary-color)] mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-[var(--primary-color)] rounded-full inline-block" />
        عروض الفنيين
        <span className="text-sm font-normal text-gray-400">({proposals.length})</span>
      </h2>

      <div className="bg-white border border-gray-100 rounded-2xl px-5 shadow-sm">
        {proposals.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">لا توجد عروض حتى الآن</p>
        ) : (
          proposals.map((proposal) => (
            <ProposalRow key={proposal._id} proposal={proposal} />
          ))
        )}
      </div>
    </div>
  );
}