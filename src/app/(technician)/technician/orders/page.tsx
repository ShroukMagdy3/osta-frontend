"use client";

import HeroSection from "@/components/sections/technician/current-orders/HeroSection";
import TechnicianRequestsSection from "@/components/sections/technician/current-orders/TechnicianRequestsSection";


export default function OrdersPage() {

  return (
    <div className="min-h-screen">
      <HeroSection />
      <TechnicianRequestsSection />
    </div>
  );
}
