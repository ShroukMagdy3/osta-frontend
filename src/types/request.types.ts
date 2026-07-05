export type RequestStatus =
    | "pending"
    | "accepted"
    | "in_progress"
    | "on_the_way"
    | "started"
    | "completed"
    | "cancelled";

export type DepositStatus = "unpaid" | "pending" | "paid";

export interface AssignedRequestUser {
    _id?: string;
    fullName?: string;
    phone?: string;
    governorate?: string;
    city?: string;
}

export interface AssignedRequestService {
    _id?: string;
    name?: string;
    priceRange?: {
        min?: number;
        max?: number;
    };
    image?: string;
}

export interface AssignedRequestPostProposal {
    _id?: string;
    estimatedTime?: string;
    price?: number;
}

export interface AssignedRequestPost {
    _id?: string;
    title?: string;
    budget?: number;
    acceptedProposal?: AssignedRequestPostProposal | null;
    image?: string;
}

export interface AssignedRequestAddress {
    fullAddress?: string;
    district?: string;
    coordinates?: {
        lat?: number;
        lng?: number;
    };
}

export interface AssignedRequest {
    _id: string;
    requestId?: string | null;
    chatRequestId?: string | null;
    proposalId?: string;
    pendingSource?: "request" | "proposal";
    title?: string;
    status: RequestStatus;
    depositAmount?: number;
    depositStatus?: DepositStatus;
    preferredDate?: string;
    preferredTime?: string;
    createdAt?: string;
    updatedAt?: string;
    notes?: string | null;
    completionNote?: string | null;
    totalPrice?: number;
    userId?: AssignedRequestUser;
    serviceId?: AssignedRequestService | null;
    postId?: AssignedRequestPost | null;
    address?: AssignedRequestAddress;
    extraMaterialsPrice?: number;
    isFullyPaid?: boolean;
    assignedTechnician?: {
        _id?: string;
        fullName?: string;
    };
    review?: {
        rating?: number;
        review?: string;
    };
    cancellation: {
        reason?: string;
    };
    technicianReview?: {
        rating?: number;
        review?: string;
    };
}

export interface PaginatedResponseMeta {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}
