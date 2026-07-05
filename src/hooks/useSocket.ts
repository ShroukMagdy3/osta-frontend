/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {useEffect, useRef, useState} from "react";
import {Socket} from "socket.io-client";
import {connectSocket, disconnectSocket} from "@/lib/socket";

export function useSocket(token: string | null) {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) return;

        const socket = connectSocket(token);
        socketRef.current = socket;

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        if (socket.connected) setIsConnected(true);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            disconnectSocket();
            setIsConnected(false);
        };
    }, [token]);

    return {socket: socketRef.current, isConnected};
}
