"use client";

import { RefObject, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/hooks/useNotifications";
import { getNotificationRoute } from "@/lib/notification-routing";

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "الآن";
  if (diffMin < 60)
    return `منذ ${diffMin} ${diffMin === 1 ? "دقيقة" : "دقائق"}`;
  if (diffHour < 24)
    return `منذ ${diffHour} ${diffHour === 1 ? "ساعة" : "ساعات"}`;
  return `منذ ${diffDay} ${diffDay === 1 ? "يوم" : "أيام"}`;
}

interface NotificationPanelProps {
  notifications: NotificationItem[];
  isLoading: boolean;
  onClose: () => void;
  targetRoute: string;
  anchorRef: RefObject<HTMLElement | null>;
}

export default function NotificationPanel({
  notifications,
  isLoading,
  onClose,
  targetRoute,
}: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = (notification: NotificationItem) => {
    onClose();
    router.push(getNotificationRoute(notification, targetRoute));
  };

  return (
    // 🔧 الفكرة الأساسية في الفكس: بدل ما نحسب الإحداثيات بالـ JS
    // (getBoundingClientRect) ونعمل position: fixed — بنخلي البانل
    // absolute جوه الـ div الأب اللي فيه زرار الجرس (اللي أصلاً عليه
    // className="relative" في الـ Navbar). ده بالظبط نفس الأسلوب اللي
    // شغال كويس مع الـ profile dropdown، وبيظهر تحت الجرس مباشرة من
    // غير أي حسابات أو مشاكل توقيت.
    <div
      ref={panelRef}
      className="absolute top-full end-0 z-[999999] mt-2 flex max-h-[70vh] w-[min(20rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[20px] border border-[#EAECE8] bg-white shadow-[0_18px_42px_rgba(17,45,39,0.18)] sm:max-h-[26rem]"
    >
      <div className="flex-shrink-0 border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-[#112D27]">الإشعارات</h3>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-gray-400">
            جارٍ التحميل...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-gray-400">
            لا توجد إشعارات حتى الآن
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() => handleNotificationClick(notification)}
                className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-right transition-colors duration-300 hover:bg-[#F6F5F1] ${
                  notification.isRead
                    ? "bg-white"
                    : "bg-[#F6F5F1] shadow-[inset_3px_0_0_var(--primary-color)]"
                }`}
              >
                <span className="flex w-full items-center gap-2">
                  {!notification.isRead && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-color)]" />
                  )}
                  <span
                    className={`text-sm leading-snug ${
                      notification.isRead
                        ? "font-medium text-[#112D27]/80"
                        : "font-semibold text-[#112D27]"
                    }`}
                  >
                    {notification.title}
                  </span>
                </span>

                <span className="break-words text-xs leading-5 text-gray-500">
                  {notification.body}
                </span>

                <span className="text-[11px] text-gray-400">
                  {formatRelativeTime(notification.createdAt)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}