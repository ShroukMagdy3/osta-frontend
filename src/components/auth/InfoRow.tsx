import React from "react";

type InfoRowProps = {
  label: string;
  value: string;
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0" dir="rtl">
      <div className="flex items-center gap-2">
        <span className="text-[var(--primary-color)] font-bold text-sm whitespace-nowrap">{label} :</span>
        <span className="text-gray-600 text-sm">{value}</span>
      </div>
    </div>
  );
};

export default InfoRow;