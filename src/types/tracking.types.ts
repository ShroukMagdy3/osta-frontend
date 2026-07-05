export interface TechnicianRequest {
  _id: string;
  serviceId: { name: string; priceRange?: { min: number; max: number } };
  categoryId: { name: string };
  userId: { fullName: string };
  status: "accepted" | "on_the_way" | "started" | "completed" | string;
  assignedTechnician: { fullName: string } | null;
  address: { fullAddress: string; district: string };
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
  servicePrice?: number;
  totalPrice?: number;
  completionNote?: string | null;
  extraMaterialsPrice?: number;
}