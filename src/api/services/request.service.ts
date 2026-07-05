import {api} from "@/api/axios";
import type {AssignedRequest, PaginatedResponseMeta} from "@/types/request.types";

export const getRequestById = async (id: string) => {
    const res = await api.get(`/requests/${id}`);
    return res.data;
};

export const updateRequestStatus = async (
    id: string,
    action: "on-the-way" | "start" | "complete",
    body?: {totalPrice?: number; completionNote?: string}
) => {
    const res = await api.patch(`/requests/${id}/${action}`, body ?? {});
    return res.data;
};

interface AssignedRequestsApiShape {
    data?: AssignedRequest[];
    meta?: PaginatedResponseMeta;
}

export interface AssignedRequestsResult {
    data: AssignedRequest[];
    meta?: PaginatedResponseMeta;
}

const isAssignedRequestArray = (value: unknown): value is AssignedRequest[] => Array.isArray(value);

const mergeAssignedRequests = (...requestGroups: AssignedRequest[][]) => {
    const merged = new Map<string, AssignedRequest>();

    requestGroups.flat().forEach((request) => {
        if (!request?._id) return;
        merged.set(request._id, request);
    });

    return Array.from(merged.values()).sort((left, right) => {
        const leftTime = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
        const rightTime = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();
        return rightTime - leftTime;
    });
};

const extractAssignedRequests = (payload: AssignedRequestsApiShape | {data?: AssignedRequestsApiShape}) => {
    const nested = payload && "data" in payload ? payload.data : undefined;
    const data = isAssignedRequestArray(nested) ? nested : isAssignedRequestArray(nested?.data) ? nested.data : [];
    const meta = nested && !Array.isArray(nested) && "meta" in nested ? nested.meta : undefined;

    return {data, meta};
};

export const getAssignedRequests = async (): Promise<AssignedRequestsResult> => {
    const [assignedResponse, customAssignedResponse] = await Promise.all([
        api.get("/requests/assigned"),
        api.get("/posts/technician/assigned"),
    ]);

    const assignedPayload = assignedResponse.data as AssignedRequestsApiShape | {data?: AssignedRequestsApiShape};
    const customPayload = customAssignedResponse.data as AssignedRequestsApiShape | {data?: AssignedRequestsApiShape};

    const assigned = extractAssignedRequests(assignedPayload);
    const customAssigned = extractAssignedRequests(customPayload);

    return {
        data: mergeAssignedRequests(assigned.data, customAssigned.data),
        meta: assigned.meta,
    };
};

export const markRequestOnTheWay = async (id: string) => {
    return await api.patch(`/requests/${id}/on-the-way`);
};
export const getMyRequests = async (): Promise<AssignedRequestsResult> => {
  const response = await api.get("/requests/my");
  const payload = response.data as AssignedRequestsApiShape | { data?: AssignedRequestsApiShape };

  const nested = payload && "data" in payload ? payload.data : undefined;
  const data = isAssignedRequestArray(nested)
    ? nested
    : isAssignedRequestArray(nested?.data)
    ? nested.data
    : [];

  const meta =
    nested && !Array.isArray(nested) && "meta" in nested ? nested.meta : undefined;

  return { data, meta };
};
export const getServicesHistory = async (): Promise<AssignedRequestsResult> => {
  const [assignedResponse, customAssignedResponse] = await Promise.all([
    api.get("/requests/assigned"),
    api.get("/posts/technician/assigned"),
  ]);

  const assignedPayload = assignedResponse.data as AssignedRequestsApiShape | { data?: AssignedRequestsApiShape };
  const customPayload = customAssignedResponse.data as AssignedRequestsApiShape | { data?: AssignedRequestsApiShape };

  const assigned = extractAssignedRequests(assignedPayload);
  const customAssigned = extractAssignedRequests(customPayload);

  const allRequests = mergeAssignedRequests(assigned.data, customAssigned.data);

  // Only return completed and cancelled — the history
  const historyOnly = allRequests.filter(
    (r) => r.status === "completed" || r.status === "cancelled",
  );

  return { data: historyOnly, meta: assigned.meta };
};
