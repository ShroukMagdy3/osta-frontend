"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import logo from "@/assets/images/logo.svg";

interface Props {
  backLabel?: string;
  onBack?: () => void;
}

export default function TrackingNav({ backLabel = "الطلبات", onBack }: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-[#FEFEFE70]/50 backdrop-blur-md p-2 shadow-sm"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
        <Image
          src={logo}
          alt="أسطى"
          priority
          className="h-8 w-auto object-contain"
        />

        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[var(--primary-color)] transition-colors"
        >
          <span>{backLabel}</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
