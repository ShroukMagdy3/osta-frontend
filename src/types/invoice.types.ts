export interface InvoicePerson {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
}

export interface InvoiceRequestInfo {
  _id: string;
  address?: {
    fullAddress?: string;
    district?: string;
  };
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  completionNote?: string;
  status?: string;
  categoryId?: { _id: string; name: string };
  serviceId?: { _id: string; name: string; priceRange?: { min: number; max: number } };
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  requestId: InvoiceRequestInfo | null;
  clientId: InvoicePerson;
  technicianId: InvoicePerson;
  depositAmount: number;
  totalPrice: number;
  remainingAmount: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}