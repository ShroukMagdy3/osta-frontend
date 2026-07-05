import { api } from "@/api/axios";

export type TicketStatus = "open" | "in_progress" | "pending" | "closed";

export interface SupportTicket {
  _id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  attachmentUrl: string | null;
  attachmentName: string | null;
  attachmentSize: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTickets {
  data: SupportTicket[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export const supportService = {
getMyTickets: (page = 1, limit = 10) =>
  api.get<PaginatedTickets>("/support/my", {
    params: { page, limit },
  }),

  getTicketById: (id: string) =>
    api.get<{ data: SupportTicket }>(`/support/${id}`),

  createTicket: (payload: { title: string; description: string; attachment?: File | null }) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    if (payload.attachment) {
      formData.append("attachment", payload.attachment);
    }
    return api.post<{ data: SupportTicket }>("/support", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteTicket: (id: string) => api.delete(`/support/${id}`),
};
