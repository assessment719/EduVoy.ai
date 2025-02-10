import { WebSocketServer, WebSocket } from "ws";
import { ConnectedUsers, ConnectedAdmins, PendingMessages } from './interfaces'

const chatServer = new WebSocketServer({ port: 8080 });
const updateServer = new WebSocketServer({ port: 9090 });

let allConnectedUsers: ConnectedUsers[] = [];
let allConnectedAdmins: ConnectedAdmins[] = [];
let pendingMessages: PendingMessages[] = [];

let adminUpdateSocket: any = null;

const sendJson = (socket: WebSocket, data: object) => {
    try {
        socket.send(JSON.stringify(data));
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

// Chat server logic
chatServer.on("connection", (socket) => {

    socket.on("message", (message) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message.toString());
        } catch (error) {
            console.error("Invalid message format:", message);
            return;
        }

        const { type, payload } = parsedMessage;

        if (adminUpdateSocket === null) {
            // Admin is not connected to update server
            if (type === "join") {
                allConnectedUsers.push({
                    userName: payload.name,
                    socket: socket,
                    roomId: payload.roomId,
                });
            } else {
                pendingMessages.push({
                    message: payload.message,
                    roomId: payload.roomId,
                });
                sendJson(socket, { role: "user", message: payload.message });
            }
        } else {
            // Admin is connected to update server
            if (allConnectedAdmins.length === 0) {
                if (payload.role === "user") {
                    if (type === "join") {
                        sendJson(adminUpdateSocket, {
                            type: "newuser",
                            payload: { userName: payload.name, roomId: payload.roomId },
                        });

                        allConnectedUsers.push({
                            userName: payload.name,
                            socket: socket,
                            roomId: payload.roomId,
                        });
                    } else {
                        sendJson(socket, { role: "user", message: payload.message });
                        sendJson(adminUpdateSocket, {
                            type: "newmessage",
                            payload: { message: payload.message, roomId: payload.roomId },
                        });
                        pendingMessages.push({
                            message: payload.message,
                            roomId: payload.roomId,
                        });
                    }
                } else {
                    if (type === "join") {
                        allConnectedAdmins.push({
                            socket: socket,
                            roomId: payload.roomId
                        })

                        const user = allConnectedUsers.find((u) => u.roomId === payload.roomId);
                        sendJson(adminUpdateSocket, {
                            type: "adminjoined",
                            payload: { userName: user?.userName, joinedRoom: payload.roomId },
                        });
                    }
                }
            } else {
                if (payload.role === "user") {
                    if (type === "join") {
                        sendJson(adminUpdateSocket, {
                            type: "newuser",
                            payload: { userName: payload.name, roomId: payload.roomId },
                        });

                        allConnectedUsers.push({
                            userName: payload.name,
                            socket: socket,
                            roomId: payload.roomId,
                        });
                    } else {
                        sendJson(socket, { role: "user", message: payload.message });

                        allConnectedAdmins.forEach((admin) => {
                            if (payload.roomId === admin.roomId) {
                                sendJson(admin.socket, { role: "user", message: payload.message });
                            } else {
                                sendJson(adminUpdateSocket, {
                                    type: "newmessage",
                                    payload: { message: payload.message, roomId: payload.roomId },
                                });

                                pendingMessages.push({
                                    message: payload.message,
                                    roomId: payload.roomId,
                                });
                            }
                        })
                    }
                } else {
                    
                    if (type === "join") {
                        allConnectedAdmins.push({
                            socket: socket,
                            roomId: payload.roomId
                        })

                        const user = allConnectedUsers.find((u) => u.roomId === payload.roomId);

                        sendJson(adminUpdateSocket, {
                            type: "adminjoined",
                            payload: { userName: user?.userName, joinedRoom: payload.roomId },
                        });
                    } else {
                        allConnectedAdmins.forEach((admin) => {
                            if (admin.roomId === payload.roomId) {
                                sendJson(admin.socket, { role: "admin", message: payload.message });
                            }
                        })

                        allConnectedUsers.forEach((user) => {
                            if (user.roomId === payload.roomId) {
                                sendJson(user.socket, { role: "admin", message: payload.message });
                            }
                        });
                    }
                }
            }
        }
    });

    socket.on("close", () => {
        if (allConnectedAdmins.length > 0) {
            allConnectedAdmins.forEach((admin) => {
                if (socket === admin.socket) {
                    sendJson(adminUpdateSocket, {
                        type: "leftUserOrAdmin",
                        payload: { whoLeft: "admin", roomId: admin.roomId }
                    });

                    pendingMessages = pendingMessages.filter(
                        (message) => message.roomId !== admin.roomId
                    );

                    allConnectedAdmins = allConnectedAdmins.filter((admin) => {
                        admin.socket !== socket
                    })
                } else {
                    const user = allConnectedUsers.find((u) => u.socket === socket);

                    if (user) {
                        sendJson(adminUpdateSocket, {
                            type: "leftUserOrAdmin",
                            payload: { whoLeft: "user", roomId: user.roomId }
                        });
                        
                        allConnectedUsers = allConnectedUsers.filter(
                            (user) => user.socket !== socket
                        );

                        pendingMessages = pendingMessages.filter(
                            (message) => message.roomId !== (user ? user.roomId : "")
                        );
                    }
                }
            })
        } else {
            const user = allConnectedUsers.find((u) => u.socket === socket);

            if (user) {
                if (adminUpdateSocket) {
                    sendJson(adminUpdateSocket, {
                        type: "leftUserOrAdmin",
                        payload: { whoLeft: "user", roomId: user.roomId }
                    });
                }

                allConnectedUsers = allConnectedUsers.filter(
                    (user) => user.socket !== socket
                );

                pendingMessages = pendingMessages.filter(
                    (message) => message.roomId !== (user ? user.roomId : "")
                );
            }
        }
    });
});

// Update Server Logic
updateServer.on("connection", (socket) => {
    adminUpdateSocket = socket;

    allConnectedUsers.forEach((user) => {
        sendJson(socket, {
            type: "newuser",
            payload: { userName: `${user.userName}`, roomId: `${user.roomId}` }
        });
    });

    pendingMessages.forEach((message) => {
        sendJson(socket, {
            type: "newmessage",
            payload: message
        });
    });

    socket.on("close", () => {
        adminUpdateSocket = null;
    });
});