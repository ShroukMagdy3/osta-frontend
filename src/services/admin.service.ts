import { api } from "@/api/axios";
import {
  AdminDashboardData,
  AdminTechnician,
  AdminUser,
  PaginationMeta,
} from "@/types/admin.types";

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export const getAdminDashboard = () => {
  return api.get<{ data: AdminDashboardData }>("/admin/dashboard");
};

export const getPendingTechnicians = (page = 1, limit = 10) => {
  return api.get<PaginatedResponse<AdminTechnician>>(
    `/admin/technicians/pending?page=${page}&limit=${limit}`,
  );
};

export const getApprovedTechnicians = (page = 1, limit = 10) => {
  return api.get<PaginatedResponse<AdminTechnician>>(
    `/admin/technicians?page=${page}&limit=${limit}`,
  );
};

export const approveTechnician = (technicianId: string) => {
  return api.patch<{ data: AdminTechnician }>(
    `/admin/technicians/${technicianId}/approve`,
  );
};

export const rejectTechnician = (technicianId: string, reason: string) => {
  return api.patch<{ data: AdminTechnician }>(
    `/admin/technicians/${technicianId}/reject`,
    { reason },
  );
};

export const getAdminUsers = (
  page = 1,
  limit = 10,
  role?: AdminUser["role"],
) => {
  const roleQuery = role ? `&role=${role}` : "";
  return api.get<PaginatedResponse<AdminUser>>(
    `/admin/users?page=${page}&limit=${limit}${roleQuery}`,
  );
};

export const setUserAsAdmin = (userId: string) => {
  return api.patch<{ data: AdminUser }>(`/admin/users/${userId}/set-admin-role`);
};
