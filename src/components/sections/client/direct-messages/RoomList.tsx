"use client";

import { Room } from "@/types/chat.types";

interface Props {
  rooms: Room[];
  activeRoomId: string | null;
  onSelect: (room: Room) => void;
}

function formatTime(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    const h = date.getHours();
    const m = String(date.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "م" : "ص";
    return `${h % 12 || 12}:${m} ${ampm}`;
  }
  return "أمس";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

// ألوان avatar ثابتة بناءً على أول حرف من الاسم — عشان كل شخص ياخد لون مميز وثابت
const AVATAR_COLORS = [
  "bg-[#DCEFD0] text-[#3F6B2C]",
  "bg-[#FCE8D6] text-[#B5651D]",
  "bg-[#E4E0F9] text-[#5B4FA6]",
  "bg-[#FDE2E2] text-[#B23A3A]",
];

function getAvatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function RoomList({ rooms, activeRoomId, onSelect }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#EEF1EF] flex-shrink-0">
        <h2 className="text-base font-bold text-[#112D27]">الرسائل</h2>
        <p className="text-xs text-[#7C8B85] mt-1 leading-relaxed">
          هنا يمكنك التواصل مع الفنيين أو العملاء بشأن الطلبات النشطة قبل بدء
          التنفيذ. تُحذف المحادثات تلقائيًا بعد انتهاء الخدمة.
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center h-full">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">لا توجد محادثات نشطة</p>
            <p className="text-xs text-gray-300">
              ستظهر محادثاتك هنا بعد قبول طلب
            </p>
          </div>
        ) : (
          rooms.map((room) => {
            const isActive = room.id === activeRoomId;
            const initials = getInitials(room.otherPartyName);
            const avatarColor = getAvatarColor(room.otherPartyName);

            return (
              <button
                key={room.id}
                onClick={() => onSelect(room)}
                className={`w-full flex items-start gap-3 px-5 py-3.5 border-b border-[#F4F6F4] transition-colors text-right ${
                  isActive ? "bg-[#F6FAF3]" : "hover:bg-[#FAFBFA]"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${avatarColor}`}
                  >
                    {initials}
                  </div>
                  {room.isOnline && (
                    <span className="absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full bg-[#6FCF4D] border-2 border-white" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold text-[#112D27] truncate">
                      {room.otherPartyName}
                    </span>
                    <span className="text-[11px] text-[#9AA6A1] flex-shrink-0">
                      {formatTime(room.lastMessageTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1 gap-2">
                    <p className="text-xs text-[#7C8B85] truncate flex-1">
                      {room.lastMessage ?? room.title}
                    </p>
                    {room.unreadCount > 0 && (
                      <span className="w-4.5 h-4.5 min-w-[18px] rounded-full bg-[#7CB342] text-white text-[10px] flex items-center justify-center font-medium flex-shrink-0">
                        {room.unreadCount > 9 ? "9+" : room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer notice */}
      <div className="px-5 py-4 border-t border-[#EEF1EF] flex-shrink-0">
        <p className="text-[11px] text-[#9AA6A1] leading-relaxed">
          يمكنك التواصل مع الطرف الآخر طوال فترة تنفيذ الخدمة. تُحذف المحادثات
          تلقائيًا بعد اكتمال الطلب للحفاظ على خصوصية المستخدمين.
        </p>
      </div>
    </div>
  );
}
