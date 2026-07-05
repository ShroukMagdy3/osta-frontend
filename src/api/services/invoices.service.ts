import { api } from "@/api/axios";
import type { Invoice } from "@/types/invoice.types";

export const invoiceApi = {
  async getMyInvoices(): Promise<Invoice[]> {
    const res = await api.get<{ data: Invoice[] }>("/invoices/my");
    return res.data?.data ?? (res.data as unknown as Invoice[]);
  },
};