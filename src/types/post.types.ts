// ─── Shared types for posts/proposals flow ─────────────────────────────────────

export interface Post {
    _id: string;
    userId: string | {_id: string; fullName: string; phone?: string};
    categoryId: {_id: string; name: string};
    title?: string;
    description: string;
    address: {
        fullAddress: string;
        district: string;
        coordinates?: {lat: number; lng: number};
    };
    preferredDate: string;
    preferredTime: string;
    budget?: number | null;
    isEmergency?: boolean;
    image?: string | null;
    status: "open" | "accepted" | "cancelled";
    acceptedProposal?: string | Proposal | null;
    requestId?: string | null;
    hasApplied?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Proposal {
    _id: string;
    postId: string;
    description: string | null;
    price: number;
    estimatedTime?: string;
    message?: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;

    technician: {
        _id: string;
        fullName: string;
        phone?: string;
        governorate?: string;
        city?: string;
        gender?: string;

        averageRating?: number;
        totalReviews?: number;
        yearsOfExperience?: number;
        verificationStatus?: string;
        personalImage?: string;

        specialization?: {
            categoryId: string;
        };
    };
}
