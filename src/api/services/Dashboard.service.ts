import { api } from "@/api/axios";

export const getUserDashboard = () => api.get("/users/dashboard");

export const getTechnicianDashboard = () => api.get("/technician/dashboard");