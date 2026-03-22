import { io, Socket } from "socket.io-client";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import api from "./api";
import { toast } from "sonner";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8080", {
    auth: { token },
  });

  socket.on("server:new_message", (payload) => {
    const { roomId, content, from, timeStamp, _id, viewedBy } = payload;
    useChatStore.getState().addMessage(roomId, {
      _id: _id || Date.now().toString(),
      content,
      from,
      to: roomId,
      createdAt: timeStamp,
      updatedAt: timeStamp,
      viewedBy,
    });
  });

  socket.on("server:user_typing", ({ roomId, userId }) => {
    const rooms = useChatStore.getState().rooms;
    const room = rooms.find((r) => r._id === roomId);
    let username = "Someone";

    if (room) {
      const member = (room.roomMembers as any[]).find((m) => m._id === userId);
      if (member) username = member.username;
    }

    useChatStore.getState().addTypingUser({ roomId, userId, username });
    setTimeout(() => {
      useChatStore.getState().removeTypingUser(roomId, userId);
    }, 3000);
  });

  socket.on("server:user_online", ({ userId }) => {
    useChatStore.getState().setUserOnline(userId, true);
  });

  socket.on("server:user_offline", ({ userId }) => {
    useChatStore.getState().setUserOnline(userId, false);
  });

  socket.on("server:viewed_message", ({ messageId, roomId, viewedBy }) => {
    useChatStore
      .getState()
      .updateMessageStatus(roomId, messageId, "read", viewedBy);
  });

  socket.on("server:initial_online_users", (userIds: string[]) => {
    useChatStore.getState().setOnlineUsers(userIds);
  });

  socket.on("server:added_to_group", ({ roomId }) => {
    socket?.emit("client:join_room", { roomId });
    api
      .get("/rooms/all")
      .then((res) => useChatStore.getState().setRooms(res.data.rooms));
    toast.info("You were added to a new group!");
  });

  socket.on("server:group_updated", async ({ roomId }) => {
    try {
      const res = await api.get(`/rooms/${roomId}`);
      const updatedRoom = res.data.activeRoom;

      if (updatedRoom) {
        useChatStore.getState().updateRoomData(updatedRoom);
      }
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 404) {
        useChatStore.getState().removeRoomFromList(roomId);
        toast.error("You are no longer a member of that group");
      }
    }
  });
  socket.on("connect_error", (err) => {
    if (err.message === "Not Authenticated") {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
  });

  socket.on("connect", () => console.log("✅ Socket connected"));
  socket.on("disconnect", () => console.log("❌ Socket disconnected"));

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
