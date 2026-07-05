"use client";

import {useEffect, useRef, useState, useCallback} from "react";
import {Socket} from "socket.io-client";
import {
    ChatComposerPayload,
    Message,
    Room,
    NewMessagePayload,
    MessagesReadPayload,
    JoinedRoomPayload,
} from "@/types/chat.types";
import {chatService} from "@/api/services/chat.service";
import {playMessageBeep} from "./useMessageSound";

interface UseChatOptions {
    socket: Socket | null;
    room: Room | null;
    currentUserId: string;
    onHistoryLoaded?: () => void;
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === "object" && error !== null) {
        const responseMessage = (error as {response?: {data?: {message?: unknown}}}).response?.data?.message;
        if (typeof responseMessage === "string" && responseMessage.trim()) return responseMessage;
        if (Array.isArray(responseMessage) && typeof responseMessage[0] === "string") return responseMessage[0];

        const directMessage = (error as {message?: unknown}).message;
        if (typeof directMessage === "string" && directMessage.trim()) return directMessage;
    }

    return fallback;
}

export function useChat({socket, room, currentUserId, onHistoryLoaded}: UseChatOptions) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const joinedRoomRef = useRef<string | null>(null);

    const fetchHistory = useCallback(
        async (targetRoom: Room) => {
            setIsLoadingHistory(true);
            setError(null);

            try {
                let msgs: Message[];

                if (targetRoom.variant === "fixed" && targetRoom.requestId) {
                    msgs = await chatService.getRequestMessages(targetRoom.requestId);
                } else if (targetRoom.variant === "custom" && targetRoom.postId && targetRoom.technicianId) {
                    msgs = await chatService.getCustomMessages(targetRoom.postId, targetRoom.technicianId);
                } else {
                    msgs = [];
                }

                setMessages(msgs);
                onHistoryLoaded?.();
            } catch (error) {
                setMessages([]);
                setError(getErrorMessage(error, "تعذر تحميل الرسائل حالياً."));
            } finally {
                setIsLoadingHistory(false);
            }
        },
        [onHistoryLoaded]
    );

    const joinRoom = useCallback(
        (targetRoom: Room) => {
            if (!socket) return;

            if (targetRoom.variant === "fixed" && targetRoom.requestId) {
                socket.emit("joinRoom", {requestId: targetRoom.requestId});
            } else if (targetRoom.variant === "custom" && targetRoom.postId) {
                socket.emit("joinCustomRoom", {
                    postId: targetRoom.postId,
                    ...(targetRoom.technicianId ? {technicianId: targetRoom.technicianId} : {}),
                });
            }
        },
        [socket]
    );

    const sendMessage = useCallback(
        async ({content, image}: ChatComposerPayload) => {
            if (!room) return false;

            const trimmedContent = content.trim();
            if (!trimmedContent && !image) return false;

            setError(null);
            setIsSending(true);

            try {
                if (room.variant === "fixed" && room.requestId) {
                    await chatService.sendRequestMessage(room.requestId, {
                        content: trimmedContent,
                        image,
                    });
                } else if (room.variant === "custom" && room.postId && room.technicianId) {
                    await chatService.sendCustomMessage(room.postId, room.technicianId, {
                        content: trimmedContent,
                        image,
                    });
                } else {
                    return false;
                }
                return true;
            } catch (error) {
                setError(getErrorMessage(error, "تعذر إرسال الرسالة حالياً."));
                return false;
            } finally {
                setIsSending(false);
            }
        },
        [room]
    );

    const markAsRead = useCallback(() => {
        if (!socket || !room) return;

        if (room.variant === "fixed" && room.requestId) {
            socket.emit("markAsRead", {requestId: room.requestId});
        } else if (room.variant === "custom" && room.postId) {
            socket.emit("markCustomAsRead", {
                postId: room.postId,
                ...(room.technicianId ? {technicianId: room.technicianId} : {}),
            });
        }
    }, [socket, room]);

    useEffect(() => {
        if (!room) return;

        const roomKey = room.id;
        if (joinedRoomRef.current === roomKey) return;
        joinedRoomRef.current = roomKey;

        setMessages([]);
        setIsClosed(false);
        setUnreadCount(0);
        setError(null);

        void fetchHistory(room);
        joinRoom(room);
    }, [room, fetchHistory, joinRoom]);

    useEffect(() => {
        if (!socket || !room) return;

        const onJoinedRoom = ({unreadCount}: JoinedRoomPayload) => {
            setUnreadCount(typeof unreadCount === "number" ? unreadCount : unreadCount?.count ?? 0);
        };

        const onNewMessage = (payload: NewMessagePayload) => {
            setError(null);

            const msg: Message = {
                _id: payload._id,
                roomId: payload.roomId,
                roomType: payload.roomType,
                senderId: payload.senderId,
                senderRole: payload.senderRole,
                content: payload.content,
                imageUrl: payload.imageUrl ?? null,
                isRead: payload.isRead,
                createdAt: payload.createdAt,
            };

            setMessages((prev) => [...prev, msg]);

            if (payload.senderId !== currentUserId) {
                markAsRead();
                // صوت الرسالة — بس لو الرسالة جاية من الطرف التاني، مش منك
                playMessageBeep();
            }
        };

        const onMessagesRead = ({readBy}: MessagesReadPayload) => {
            if (readBy !== currentUserId) {
                setMessages((prev) =>
                    prev.map((message) =>
                        typeof message.senderId === "string"
                            ? message.senderId === currentUserId
                                ? {...message, isRead: true}
                                : message
                            : message.senderId._id === currentUserId
                            ? {...message, isRead: true}
                            : message
                    )
                );
            }
        };

        const onRoomClosed = () => setIsClosed(true);
        const onCustomRoomClosed = () => setIsClosed(true);
        const onSocketError = (payload: {message?: string}) => {
            setError(payload.message?.trim() || "حدث خطأ في المحادثة.");
        };

        socket.on("joinedRoom", onJoinedRoom);
        socket.on("joinedCustomRoom", onJoinedRoom);
        socket.on("newMessage", onNewMessage);
        socket.on("newCustomMessage", onNewMessage);
        socket.on("messagesRead", onMessagesRead);
        socket.on("roomClosed", onRoomClosed);
        socket.on("customRoomClosed", onCustomRoomClosed);
        socket.on("error", onSocketError);

        return () => {
            socket.off("joinedRoom", onJoinedRoom);
            socket.off("joinedCustomRoom", onJoinedRoom);
            socket.off("newMessage", onNewMessage);
            socket.off("newCustomMessage", onNewMessage);
            socket.off("messagesRead", onMessagesRead);
            socket.off("roomClosed", onRoomClosed);
            socket.off("customRoomClosed", onCustomRoomClosed);
            socket.off("error", onSocketError);
        };
    }, [socket, room, currentUserId, markAsRead]);

    return {
        messages,
        isLoadingHistory,
        isClosed,
        isSending,
        unreadCount,
        error,
        sendMessage,
        markAsRead,
        retryHistory: room ? () => fetchHistory(room) : undefined,
    };
}
