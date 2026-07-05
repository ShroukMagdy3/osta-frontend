"use client";

import HeroSection from "@/components/sections/technician/stores/HeroSection";
import StoresSearchSection from "@/components/sections/technician/stores/StoresSearchSection";

export default function StoresPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StoresSearchSection />
    </div>
  );
}
