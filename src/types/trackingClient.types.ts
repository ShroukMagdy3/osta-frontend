export interface AssignedTechnician {
    _id: string;
    fullName: string;
    phone?: string;
}

export interface ClientRequest {
    _id: string;
    serviceId: {name: string};
    userId: {fullName: string};
    address: {district?: string; fullAddress?: string};
    servicePrice?: number;
    extraMaterialsPrice?: number;
    totalPrice?: number;
    depositAmount?: number;
    depositStatus?: "paid" | "unpaid";
    isFullyPaid?: boolean;
    completionNote?: string | null;
    status: string;
    createdAt: string;
    assignedTechnician?: AssignedTechnician;
    invoice?: {
        subtotal?: number;
        tax?: number;
        total?: number;
    };
}
