import type { TicketStatus } from "@/api/services/support.service";

const STATUS_CONFIG: Record<TicketStatus, { label: string; bg: string; text: string }> = {
  open: { label: "مفتوحة", bg: "#ECF7DA", text: "#5C8A1F" },
  in_progress: { label: "قيد المعالجة", bg: "#FDF1DD", text: "#C8821B" },
  pending: { label: "بانتظار", bg: "#F1F1F0", text: "#6B6B6A" },
  closed: { label: "مغلقة", bg: "#FBE7E6", text: "#C23B35" },
};

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}
