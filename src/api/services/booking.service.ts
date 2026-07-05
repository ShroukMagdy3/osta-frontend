import { api } from '@/api/axios';

export interface BookingData {
  categoryId: string;
  serviceId: string;
  address: {
    fullAddress: string;
    district: string;
    coordinates: { lat: number; lng: number };
  };
  preferredDate: string;  // "2024-02-15"
  preferredTime: string;  // "14:00"
  notes?: string;
}

export const createBooking = (data: BookingData) =>
  api.post('/requests', data);