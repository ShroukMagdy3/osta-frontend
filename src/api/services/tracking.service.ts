import { api } from "@/api/axios";
import { TechnicianRequest } from "@/types/tracking.types";

type TrackingApiPayload<T> =
  | T
  | {
      success?: boolean;
      message?: string;
      data?: T;
    };

function unwrapPayload<T>(payload: TrackingApiPayload<T>): T {
  if (payload && typeof payload === "object" && "data" in payload && payload.data) {
    return payload.data;
  }

  return payload as T;
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const responseData = error.response.data as { message?: string };
    if (responseData?.message) {
      return responseData.message;
    }
  }

  return error instanceof Error ? error.message : "حصل خطأ";
}

async function patchRequest(
  url: string,
  body?: object,
): Promise<TechnicianRequest> {
  try {
    const response = await api.patch<TrackingApiPayload<TechnicianRequest>>(url, body ?? {});
    return unwrapPayload(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export const trackingApi = {
  getById: async (id: string) => {
    try {
      const response = await api.get<TrackingApiPayload<TechnicianRequest>>(`/requests/${id}`);
      return unwrapPayload(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  onTheWay: (id: string) => patchRequest(`/requests/${id}/on-the-way`),

  start: (id: string) => patchRequest(`/requests/${id}/start`),

  complete: (
    id: string,
    body: {
      servicePrice: number;
      completionNote?: string;
      extraMaterialsPrice?: number;
    },
  ) => patchRequest(`/requests/${id}/complete`, body),
};
