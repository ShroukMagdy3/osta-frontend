/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { connectNotificationSocket, disconnectNotificationSocket } from "@/lib/notificationSocket";

export function useNotificationSocket(userId: string | null) {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const socket = connectNotificationSocket(userId);
        socketRef.current = socket;

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        if (socket.connected) setIsConnected(true);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            disconnectNotificationSocket();
            setIsConnected(false);
        };
    }, [userId]);

    return { socket: socketRef.current, isConnected };
}