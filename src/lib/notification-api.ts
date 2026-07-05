
import { AppNotification, NotificationListResponse } from '@/types/notification';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function authHeaders(): HeadersInit {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchNotifications(
  page = 1,
  limit = 20,
): Promise<NotificationListResponse> {
  const res = await fetch(
    `${API_BASE_URL}/notifications?page=${page}&limit=${limit}`,
    { headers: authHeaders() },
  );
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch unread count');
  return res.json();
}

export async function markNotificationRead(
  id: string,
): Promise<AppNotification> {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to mark all notifications as read');
}