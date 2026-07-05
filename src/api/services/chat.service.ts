import {api} from "@/api/axios";
import {Message, UnreadInfo} from "@/types/chat.types";

interface MessagesResponse {
    message: string;
    data: Message[];
}

interface UnreadCountResponse {
    message: string;
    data: UnreadInfo;
}

export const chatService = {
    getRequestMessages: async (requestId: string): Promise<Message[]> => {
        const res = await api.get<MessagesResponse>(`/chat/${requestId}/messages`);
        return res.data.data;
    },

    getCustomMessages: async (postId: string, technicianId: string): Promise<Message[]> => {
        const res = await api.get<MessagesResponse>(`/chat/custom/${postId}/${technicianId}/messages`);
        return res.data.data;
    },

    getUnreadInfo: async (requestId: string): Promise<UnreadInfo> => {
        const res = await api.get<UnreadCountResponse>(`/chat/${requestId}/unread`);
        return res.data.data;
    },

    getUnreadCount: async (requestId: string): Promise<number> => {
        const data = await chatService.getUnreadInfo(requestId);
        return data.count ?? 0;
    },

    sendRequestMessage: async (
        requestId: string,
        payload: {content?: string; image?: File | null}
    ): Promise<Message> => {
        const formData = new FormData();

        if (payload.content?.trim()) formData.append("content", payload.content.trim());
        if (payload.image) formData.append("image", payload.image);

        const res = await api.post<{message: string; data: Message}>(
            `/chat/${requestId}/messages`,
            formData,
            {headers: {"Content-Type": "multipart/form-data"}}
        );

        return res.data.data;
    },

    sendCustomMessage: async (
        postId: string,
        technicianId: string,
        payload: {content?: string; image?: File | null}
    ): Promise<Message> => {
        const formData = new FormData();

        if (payload.content?.trim()) formData.append("content", payload.content.trim());
        if (payload.image) formData.append("image", payload.image);

        const res = await api.post<{message: string; data: Message}>(
            `/chat/custom/${postId}/${technicianId}/messages`,
            formData,
            {headers: {"Content-Type": "multipart/form-data"}}
        );

        return res.data.data;
    },
};
