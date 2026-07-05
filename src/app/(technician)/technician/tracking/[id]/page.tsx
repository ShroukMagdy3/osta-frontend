"use client";

import { useCallback, useEffect, useState, use } from "react";
import { MapPin } from "lucide-react";
import { trackingApi } from "@/api/services/tracking.service";
import TrackingStepper from "@/components/sections/technician/tracking/trackingStepper";
import InvoiceModal from "@/components/sections/technician/tracking/invoiceModel";
import TrackingStepCards from "@/components/sections/technician/tracking/trackingStepCards";
import type { TechnicianRequest } from "@/types/tracking.types";
import TrackingNav from "@/components/layout/TrackingNav";
import PinnedChatCard from "@/components/sections/client/direct-messages/PinnedChatCard";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";

function getProgressFromStatus(status?: TechnicianRequest["status"]) {
  switch (status) {
    case "on_the_way":
      return 1;
    case "started":
      return 2;
    case "completed":
      return 3;
    default:
      return 0;
  }
}

export default function TechnicianTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: requestId } = use(params);

  const { token, userId } = useAuth();
  const { socket } = useSocket(token);

  const [request, setRequest] = useState<TechnicianRequest | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const syncRequest = useCallback((nextRequest: TechnicianRequest) => {
    setRequest(nextRequest);
    setProgress(getProgressFromStatus(nextRequest.status));
  }, []);

  const loadRequest = useCallback(async () => {
    setInitialLoading(true);
    setError("");

    try {
      const data = await trackingApi.getById(requestId);
      syncRequest(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
    } finally {
      setInitialLoading(false);
    }
  }, [requestId, syncRequest]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRequest();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRequest]);

  const withLoading = async (fn: () => Promise<void>) => {
    setLoading(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  const handleStep = (index: number) => {
    if (index === 0) {
      void withLoading(async () => {
        const data = await trackingApi.onTheWay(requestId);
        syncRequest(data);
      });
    } else if (index === 1) {
      void withLoading(async () => {
        const data = await trackingApi.start(requestId);
        syncRequest(data);
      });
    } else if (index === 2) {
      setShowInvoiceModal(true);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <TrackingNav />
      <div className="max-w-3xl mx-auto px-4 pt-16 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-8 py-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}
            >
              {request?.userId?.fullName?.charAt(0) ?? "؟"}
            </div>
            <div>
              <p className="text-base font-bold text-[var(--primary-color)] text-left">
                {request?.serviceId?.name ?? "متابعة الطلب"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--gray-color)]">
            <MapPin className="w-4 h-4 text-[var(--accent-color)]" />
            <span>
              {request?.address?.district ??
                request?.address?.fullAddress ??
                "—"}
            </span>
          </div>
        </div>

        {initialLoading && (
          <p className="text-center text-sm text-gray-400 my-8">
            بنحمّل تفاصيل الطلب...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 text-sm my-4">{error}</p>
        )}

        {!initialLoading && request && (
          <TrackingStepper
            progress={progress}
            loading={loading}
            onStep={handleStep}
          />
        )}
      </div>

      <div className="w-full bg-[#F8FAF9] py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {!initialLoading && request && (
            <TrackingStepCards progress={progress} request={request} />
          )}
        </div>
      </div>

      {showInvoiceModal && request && (
        <InvoiceModal
          request={request}
          requestId={requestId}
          onClose={() => setShowInvoiceModal(false)}
          onSubmitted={(updated: TechnicianRequest) => {
            syncRequest(updated);
            setShowInvoiceModal(false);
          }}
        />
      )}

      {request?.assignedTechnician && userId && (
        <PinnedChatCard
          requestId={requestId}
          otherPartyName={request.userId.fullName}
          serviceTitle={request.serviceId?.name ?? "الخدمة"}
          currentUserId={userId}
          socket={socket}
        />
      )}
    </div>
  );
}
