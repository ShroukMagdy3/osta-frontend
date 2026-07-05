export interface MaintenanceShop {
  name: string;
  address: string;
  Maps_url: string;
  phone: string | null;
}

export interface MaintenanceShopsResult {
  governorate: string;
  city: string;
  category: string;
  searchQuery: string;
  results: MaintenanceShop[];
}

export interface TechnicianDefaults {
  governorate: string;
  city: string;
  category: string;
}

export interface ShopCategory {
  _id: string;
  key: string;
  name: string;
}