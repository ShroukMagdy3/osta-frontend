"use client";

import { useCallback, useEffect, useState } from "react";
import { getAssignedRequests } from "@/api/services/request.service";
import ActiveServicesHero from "@/components/sections/technician/services/ActiveServicesHero";
import ActiveServicesSection from "@/components/sections/technician/services/ActiveServicesSection";
import type { AssignedRequest } from "@/types/request.types";
import { usePolling } from "@/hooks/usePolling";

export default function CurrentServicesPage() {
  const [requests, setRequests] = useState<AssignedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssignedRequests = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const result = await getAssignedRequests();
      setRequests(result.data);
    } catch (requestError) {
      console.error(requestError);
      if (showLoader) {
        setError("حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى بعد قليل.");
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAssignedRequests(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAssignedRequests]);

  // ── Polling: بيحدث حالة الخدمات النشطة تلقائيًا كل 8 ثواني
  usePolling(
    useCallback(() => {
      void loadAssignedRequests(false);
    }, [loadAssignedRequests]),
    8000,
  );

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <ActiveServicesHero />
      <ActiveServicesSection
        requests={requests}
        loading={loading}
        error={error}
        onRetry={() => void loadAssignedRequests(true)}
      />
    </div>
  );
}
