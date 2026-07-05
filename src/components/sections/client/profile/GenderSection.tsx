"use client";

interface Props {
  gender: string;
}

const GENDER_MAP: Record<string, { label: string; icon: string }> = {
  male: { label: "ذكر", icon: "♂" },
  female: { label: "أنثى", icon: "♀" },
};

export default function GenderSection({ gender }: Props) {
  const resolved = GENDER_MAP[gender] ?? null;

  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      dir="rtl"
    >
      <h2 className="text-lg font-bold text-[var(--primary-color)] mb-4">
        النوع
      </h2>
      {resolved ? (
        <p className="text-[var(--primary-color)] font-bold text-base flex items-center justify-end gap-2" dir="ltr">
          {resolved.label}
          <span className="text-lg">{resolved.icon}</span>
        </p>
      ) : (
        <p className="text-sm text-gray-400">غير محدد</p>
      )}
    </div>
  );
}
