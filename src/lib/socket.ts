import {io, Socket} from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token: string): Socket {
    if (!socket) {
        socket = io(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
            auth: {token},
            autoConnect: false,
            transports: ["websocket"],
        });
    }
    return socket;
}

export function connectSocket(token: string): Socket {
    const s = getSocket(token);
    if (!s.connected) s.connect();
    return s;
}

export function disconnectSocket(): void {
    socket?.disconnect();
    socket = null;
}
