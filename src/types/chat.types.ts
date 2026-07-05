export enum RoomType {
    REQUEST = "request",
    CUSTOM_REQUEST = "custom",
    COMMUNITY = "community",
    SUPPORT = "support",
}

export enum SenderRole {
    CLIENT = "client",
    TECHNICIAN = "technician",
    ADMIN = "admin",
}

export interface Message {
    _id: string;
    roomId: string;
    roomType: RoomType;
    senderId: string | {_id: string; fullName: string};
    senderRole: SenderRole;
    content: string;
    imageUrl?: string | null;
    isRead: boolean;
    isFlagged?: boolean;
    createdAt: string;
}

export type RoomVariant = "fixed" | "custom";

export interface Room {
    /** معرف فريد للـ room في الـ UI — requestId أو `${postId}_${technicianId}` */
    id: string;
    variant: RoomVariant;
    /** اسم الطرف الآخر */
    otherPartyName: string;
    /** أول حرفين للـ avatar */
    initials: string;
    /** عنوان الخدمة */
    title: string;
    /** آخر رسالة للـ preview */
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    isOnline?: boolean;
    /** للـ fixed room */
    requestId?: string;
    /** للـ custom room */
    postId?: string;
    technicianId?: string;
}

export interface SendMessagePayload {
    requestId: string;
    content: string;
}

export interface SendCustomMessagePayload {
    postId: string;
    technicianId?: string;
    content: string;
}

export interface JoinedRoomPayload {
    roomId: string;
    unreadCount: number | {count?: number};
}

export interface ChatComposerPayload {
    content: string;
    image?: File | null;
}

export interface NewMessagePayload {
    _id: string;
    roomId: string;
    roomType: RoomType;
    senderId: string;
    senderRole: SenderRole;
    content: string;
    imageUrl?: string | null;
    isRead: boolean;
    createdAt: string;
}

export interface MessagesReadPayload {
    roomId: string;
    readBy: string;
}

export interface RoomClosedPayload {
    roomId: string;
    message: string;
}

export interface CustomRoomClosedPayload {
    postId: string;
    acceptedTechnicianId: string;
    message: string;
}

/** شكل الـ response من GET /chat/:requestId/unread */
export interface UnreadInfo {
    count: number;
    lastMessage: {
        content: string;
        imageUrl?: string | null;
        createdAt: string;
        senderId: string;
        senderRole: SenderRole;
    } | null;
}
