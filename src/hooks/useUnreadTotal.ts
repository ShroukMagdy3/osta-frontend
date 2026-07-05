"use client";

import {useEffect, useState, useCallback} from "react";
import {Socket} from "socket.io-client";
import {api} from "@/api/axios";
import {getAssignedRequests} from "@/api/services/request.service";
import {mapRequestsToRooms} from "@/lib/mapRequestsToRooms";
import {AssignedRequest} from "@/types/request.types";

type ViewerRole = "client" | "technician" | "admin";

export function useUnreadTotal(
    socket: Socket | null,
    currentUserId: string | null,
    role: ViewerRole | null
) {
    const [total, setTotal] = useState(0);

    const refreshTotal = useCallback(async () => {
        if (!currentUserId || !role || role === "admin") {
            setTotal(0);
            return;
        }

        try {
            let requests: AssignedRequest[] = [];

            if (role === "client") {
                const res = await api.get("/requests/my");
                requests = res.data?.data ?? [];
            } else {
                const result = await getAssignedRequests();
                requests = result.data;
            }

            const rooms = await mapRequestsToRooms(requests, role);
            setTotal(rooms.reduce((sum, room) => sum + room.unreadCount, 0));
        } catch {
            setTotal(0);
        }
    }, [currentUserId, role]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void refreshTotal();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [refreshTotal]);

    useEffect(() => {
        if (!socket || !currentUserId || !role || role === "admin") return;

        const syncTotal = () => {
            void refreshTotal();
        };

        socket.on("connect", syncTotal);
        socket.on("newMessage", syncTotal);
        socket.on("newCustomMessage", syncTotal);
        socket.on("messagesRead", syncTotal);
        socket.on("joinedRoom", syncTotal);
        socket.on("joinedCustomRoom", syncTotal);
        socket.on("roomClosed", syncTotal);
        socket.on("customRoomClosed", syncTotal);

        return () => {
            socket.off("connect", syncTotal);
            socket.off("newMessage", syncTotal);
            socket.off("newCustomMessage", syncTotal);
            socket.off("messagesRead", syncTotal);
            socket.off("joinedRoom", syncTotal);
            socket.off("joinedCustomRoom", syncTotal);
            socket.off("roomClosed", syncTotal);
            socket.off("customRoomClosed", syncTotal);
        };
    }, [socket, currentUserId, role, refreshTotal]);

    return {total, refreshTotal};
}
