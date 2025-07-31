// src/lib/socket.js or socket.ts
import io from "socket.io-client";
import { toast } from "@/hooks/use-toast";

let Socket: ReturnType<typeof io> | null = null;

export const connectSocket = (token) => {
  Socket = io("http://20.192.25.27:4242", {
    auth: {
      token, // JWT token
    },
  });
  return Socket;
};

export const getSocket = () => Socket;

export const disconnectSocket = () => {
  if (Socket) {
    Socket.disconnect();
    Socket = null;
  }
};

const API_BASE = "http://20.192.25.27:4242";

let notificationSocket: ReturnType<typeof io> | null = null;

export const connectNotificationSocket = () => {
  if (notificationSocket) return notificationSocket;

  notificationSocket = io(API_BASE, {
    auth: { token: localStorage.getItem("token") },
    path: "/socket.io",
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  const showNotification = (data: any) => {
    console.log("📥 Notification received:", data);
    toast({
      title: `🔔 New ${data.type}`,
      description: `From ${data.from}`,
    });
  };

  notificationSocket.on("connect", () => {
    console.log("✅ Notification socket connected");
  });

  notificationSocket.on("disconnect", () => {
    console.log("❌ Notification socket disconnected");
  });

  // ✅ Ensure listener is re-attached on every reconnect
  notificationSocket.on("reconnect", (attempt) => {
    console.log(`♻️ Reconnected after ${attempt} attempts`);
     
    // 💡 Important: re-attach listener
    notificationSocket?.off("notification"); // prevent duplicate listener
    notificationSocket?.on("notification", showNotification);
  });

  // 🔄 Initial binding
  notificationSocket.on("notification", showNotification);

  return notificationSocket;
};