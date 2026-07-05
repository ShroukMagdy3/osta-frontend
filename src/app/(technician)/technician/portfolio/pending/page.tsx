"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/api/axios";
import { getAssignedRequests } from "@/api/services/request.service";
import PendingServicesHero from "@/components/sections/technician/pending-services/PendingServicesHero";
import PendingServicesSection from "@/components/sections/technician/pending-services/PendingServicesSection";
import type { AssignedRequest } from "@/types/request.types";
import { usePolling } from "@/hooks/usePolling";

const mergeRequests = (...requestGroups: AssignedRequest[][]) => {
  const merged = new Map<string, AssignedRequest>();

  requestGroups.flat().forEach((request) => {
    if (!request?._id) return;
    merged.set(request._id, request);
  });

  return Array.from(merged.values()).sort((left, right) => {
    const leftTime = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
    const rightTime = new Date(
      right.updatedAt ?? right.createdAt ?? 0,
    ).getTime();
    return rightTime - leftTime;
  });
};

export default function PendingServicesPage() {
  const [requests, setRequests] = useState<AssignedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeServicesCount, setActiveServicesCount] = useState(0);

  const loadAssignedRequests = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const ACTIVE_STATUSES = ["in_progress", "on_the_way", "started"];

      const [assignedResult, customPendingResponse] = await Promise.all([
        getAssignedRequests(),
        api.get("/posts/technician/pending"),
      ]);

      const allAssigned = assignedResult.data as AssignedRequest[];
      const customPending = (customPendingResponse.data?.data ??
        []) as AssignedRequest[];

      const activeCount = allAssigned.filter((r) =>
        ACTIVE_STATUSES.includes(r.status),
      ).length;

      setActiveServicesCount(activeCount);
      setRequests(mergeRequests(allAssigned, customPending));
    } catch (requestError) {
      console.error(requestError);
      // ما نظهرش رسالة الخطأ في الـ background polling — بس في أول تحميل
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

  // ── Polling: بيحدث حالة الطلبات المعلقة تلقائيًا كل 8 ثواني
  usePolling(
    useCallback(() => {
      void loadAssignedRequests(false);
    }, [loadAssignedRequests]),
    8000,
  );

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <PendingServicesHero />
      <PendingServicesSection
        requests={requests}
        loading={loading}
        error={error}
        onRetry={() => void loadAssignedRequests(true)}
        activeServicesCount={activeServicesCount}
        onCancelled={() => void loadAssignedRequests(false)}
      />
    </div>
  );
}
