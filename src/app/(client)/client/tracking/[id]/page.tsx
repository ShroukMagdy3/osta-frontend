"use client";

import { api } from "@/api/axios";
import { useState, useEffect, useCallback, use } from "react";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";
import TrackingNav from "@/components/layout/TrackingNav";
import PinnedChatCard from "@/components/sections/client/direct-messages/PinnedChatCard";

// ← الـ sections الجديدة
import TrackingSteps from "@/components/sections/client/tracking/TrackingSteps";
import InvoiceScreen from "@/components/sections/client/tracking/InvoiceScreen";
import RateScreen from "@/components/sections/client/tracking/RateScreen";
import RateSuccessScreen from "@/components/sections/client/tracking/RateSuccessScreen";

import { ClientRequest } from "@/types/trackingClient.types";

import {
  getErrorMessage,
  getInvoiceAmounts,
} from "@/utils/trackingClient.utils";

// interfaces + helpers كما هي ...

type Flow = "tracking" | "invoice" | "rate" | "rateSuccess";

const POLL_INTERVAL_MS = 10000;

const STATUS_PROGRESS: Record<ClientRequest["status"], number> = {
  on_the_way: 1,
  started: 2,
  completed: 3,
};

export default function ClientTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: requestId } = use(params);
  const searchParams = useSearchParams();
  const { token, userId } = useAuth();
  const { socket } = useSocket(token);

  const [request, setRequest] = useState<ClientRequest | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");
  const [flow, setFlow] = useState<Flow>(() =>
    searchParams.get("showRating") === "true" ? "rate" : "tracking",
  );
  const [givenRating, setGivenRating] = useState(0);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState("");

  const fetchRequest = useCallback(
    async (showLoader: boolean) => {
      if (showLoader) setLoadingInitial(true);

      try {
        const response = await api.get<
          ClientRequest | { data?: ClientRequest }
        >(`/requests/${requestId}`);
        const payload = response.data;
        const nextRequest =
          payload &&
          typeof payload === "object" &&
          "data" in payload &&
          payload.data
            ? payload.data
            : (payload as ClientRequest);

        setRequest(nextRequest);
        setError("");

        if (nextRequest.status === "completed") {
          setFlow((prev) => (prev === "tracking" ? "invoice" : prev));
        }
      } catch (e) {
        setError(getErrorMessage(e, "حصل خطأ في تحميل الطلب"));
      } finally {
        setLoadingInitial(false);
      }
    },
    [requestId],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchRequest(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchRequest]);

  useEffect(() => {
    if (!request || request.status === "completed") return;
    const interval = setInterval(() => {
      void fetchRequest(false);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [request, fetchRequest]);

  const handlePay = async () => {
    if (!request) {
      return;
    }

    const { remaining } = getInvoiceAmounts(request);
    if (remaining <= 0) {
      setFlow("rate");
      return;
    }

    setPaying(true);
    setPayError("");

    try {
      const response = await api.post(`/payment/remaining/${requestId}`);
      const paymentUrl = response.data?.data?.paymentUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }

      throw new Error("لم يتم الحصول على رابط الدفع");
    } catch (e) {
      setPayError(getErrorMessage(e, "حصل خطأ، حاول تاني"));
    } finally {
      setPaying(false);
    }
  };

  const handleSubmitRating = async (rating: number, comment: string) => {
    setRatingSubmitting(true);
    setRatingError("");

    try {
      await api.post("/reviews", {
        requestId,
        rating,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      });
      setGivenRating(rating);
      setFlow("rateSuccess");
    } catch (e) {
      setRatingError(getErrorMessage(e, "حصل خطأ، حاول تاني"));
    } finally {
      setRatingSubmitting(false);
    }
  };

  const progress = request ? STATUS_PROGRESS[request.status] : 0;
  const isFullyCompleted = request?.status === "completed";

  return (
    <>
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-10 min-h-100">
        <TrackingNav />

        <div className="max-w-3xl mx-auto px-4 pt-16 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-8 py-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "#fff",
                }}
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
        </div>

        {loadingInitial && !request && (
          <p className="text-center text-sm text-gray-400 mb-0 py-10">
            بانتظار بدء الخدمة
            <br />
            سيتم تحديث حالة الطلب تلقائياً عند قبول الفني وبدء التوجه إلى موقعك.
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 text-sm mb-6">{error}</p>
        )}

        {request && (
          <>
            <TrackingNav />
            <TrackingSteps
              progress={progress}
              isFullyCompleted={isFullyCompleted}
              address={request.address.fullAddress}
              assignedTechnician={request.assignedTechnician}
            />
          </>
        )}
      </div>

      {flow === "invoice" && request && (
        <InvoiceScreen
          request={request}
          onPay={handlePay}
          paying={paying}
          error={payError}
        />
      )}
      {flow === "rate" && request && (
        <RateScreen
          technicianName={request.assignedTechnician?.fullName ?? "الفني"}
          onSubmit={handleSubmitRating}
          submitting={ratingSubmitting}
          error={ratingError}
        />
      )}
      {flow === "rateSuccess" && (
        <RateSuccessScreen
          rating={givenRating}
          onBackToHome={() => router.push("/client/orders")}
        />
      )}
      {request?.assignedTechnician && userId && (
        <PinnedChatCard
          requestId={requestId}
          otherPartyName={request.assignedTechnician.fullName}
          serviceTitle={request.serviceId?.name ?? "الخدمة"}
          currentUserId={userId}
          socket={socket}
        />
      )}
    </>
  );
}
