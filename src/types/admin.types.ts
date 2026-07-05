export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  governorate?: string;
  city?: string;
  gender?: string;
  role: "client" | "technician" | "admin";
  createdAt: string;
}

export interface AdminTechnicianUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  governorate?: string;
  city?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AdminTechnicianSpecialization {
  categoryId?: string;
  serviceIds: string[];
}

export interface AdminTechnician {
  _id: string;
  userId: AdminTechnicianUser;
  specialization?: AdminTechnicianSpecialization;
  yearsOfExperience: number;
  hasTools: boolean;
  hasTransportation: boolean;
  workingDays: string[];
  startTime?: string;
  endTime?: string;
  serviceAreas: string[];
  canWorkOutsideArea: boolean;
  personalImage?: string;
  idFrontImage?: string;
  idBackImage?: string;
  certificateImage?: string;
  criminalRecordImage?: string;
  verificationStatus: "incomplete" | "pending" | "approved" | "rejected";
  rejectionReason?: string;
  verifiedAt?: string;
  currentStep: number;
  isProfileComplete: boolean;
  isAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRequestOverview {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  preferredDate?: string;
  userId?: {
    fullName?: string;
  };
  serviceId?: {
    title?: string;
    name?: string;
  };
}

export interface AdminTopTechnician {
  _id: string;
  averageRating: number;
  totalReviews: number;
  isAvailable: boolean;
  userId?: {
    fullName?: string;
    phone?: string;
  };
}

export interface AdminDashboardData {
  users: {
    total: number;
    clients: number;
    technicians: number;
    admins: number;
  };
  technicians: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    incomplete: number;
  };
  requests: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  recentRequests: AdminRequestOverview[];
  topTechnicians: AdminTopTechnician[];
}
