"use client";

import { useEffect, useState } from "react";
import ServicesHistoryHeroSection from "@/components/sections/technician/profile/ServiceHistoryHeroSection";
import ServicesHistorySection from "@/components/sections/technician/profile/ServicesHistorySection";
import { getAssignedRequests } from "@/api/services/request.service";
import type { AssignedRequest } from "@/types/request.types";

export default function ServicesHistoryPage() {
  const [orders, setOrders] = useState<AssignedRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignedRequests()
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ServicesHistoryHeroSection />
      <ServicesHistorySection orders={orders} loading={loading} />
    </div>
  );
}
