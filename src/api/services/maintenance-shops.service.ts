import { api } from "@/api/axios";
import type {
  MaintenanceShopsResult,
  TechnicianDefaults,
  ShopCategory,
} from "@/types/maintenance-shops.types";

/**
 * بيجيب بيانات الفني (المحافظة، المدينة، التخصص) عشان نستخدمها
 * كقيم افتراضية في فلاتر البحث عن المحلات.
 */
export const getTechnicianDefaults = async (): Promise<TechnicianDefaults> => {
  const { data } = await api.get("/technician/details");
  const tech = data?.data ?? data;
  // eslint-disable-next-line no-console
  console.log("[maintenance-shops] /technician/details raw response:", data);
  return {
    governorate: tech?.governorate ?? "",
    city: tech?.city ?? "",
    category: tech?.category ?? "",
  };
};

/**
 * بيجيب كل التصنيفات (الأقسام) المتاحة عشان تبان في فلتر التصنيف.
 */
export const getShopCategories = async (): Promise<ShopCategory[]> => {
  const { data } = await api.get("/categories");
  // eslint-disable-next-line no-console
  console.log("[maintenance-shops] /categories raw response:", data);
  return data?.data ?? [];
};

/**
 * بيدور على المحلات القريبة حسب المحافظة والمدينة والتصنيف.
 * الـ caching بيتعمل في الباك اند نفسه (نتيجة كل بحث بتتخزن ليومين)
 * عشان نقلل النداء على Google Places API.
 */
export const searchMaintenanceShops = async (params: {
  governorate: string;
  city: string;
  category: string;
}): Promise<MaintenanceShopsResult> => {
  const { data } = await api.get("/api/maintenance-shops", { params });
  return data?.data ?? data;
};