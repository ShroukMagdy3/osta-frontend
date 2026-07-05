"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/client/Navbar";
import OrdersHistoryHeroSection from "@/components/sections/client/orders-history/HeroSection";
import OrdersHistorySection from "@/components/sections/client/orders-history/OrdersHistorySection";
import { getMyRequests } from "@/api/services/request.service";
import type { AssignedRequest } from "@/types/request.types";
export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<AssignedRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRequests()
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
        
      <OrdersHistoryHeroSection />
      <OrdersHistorySection orders={orders} loading={loading} />
    </div>
  );
}
