import { WebSocket } from "ws";

export interface ConnectedUsers {
    userName: string;
    socket: WebSocket;
    roomId: string;
}

export interface ConnectedAdmins {
    socket: WebSocket;
    roomId: string;
}

export interface PendingMessages {
    message: string;
    roomId: string;
}