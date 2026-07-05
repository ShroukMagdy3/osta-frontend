import { io, Socket } from "socket.io-client";

let notificationSocket: Socket | null = null;
let joinedUserId: string | null = null;

export function getNotificationSocket(): Socket {
    if (!notificationSocket) {
        notificationSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
            autoConnect: false,
            transports: ["websocket"],
        });
    }
    return notificationSocket;
}

export function connectNotificationSocket(userId: string): Socket {
    const s = getNotificationSocket();

    const join = () => {
        if (joinedUserId !== userId) {
            s.emit("join", { userId });
            joinedUserId = userId;
        }
    };

    if (!s.connected) {
        s.connect();
        s.once("connect", join);
    } else {
        join();
    }

    return s;
}

export function disconnectNotificationSocket(): void {
    notificationSocket?.disconnect();
    notificationSocket = null;
    joinedUserId = null;
}