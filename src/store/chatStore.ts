import { create } from "zustand";
import type { Room, Message, TypingIndicator } from "../types";
interface ChatState {
  rooms: Room[];
  currentRoom: Room | null;
  messages: Record<string, Message[]>;
  pagination: Record<string, { page: number; hasMore: boolean }>; 
  onlineUsers: Set<string>;
  typingUsers: TypingIndicator[];
  isLoading: boolean;
  error: string | null;

  setRooms: (rooms: Room[]) => void;
  setCurrentRoom: (room: Room | null) => void;
  addMessage: (roomId: string, message: Message) => void;
  setMessages: (
    roomId: string,
    messages: Message[],
    page?: number,
    hasMore?: boolean,
  ) => void;
  updateMessageStatus: (
    roomId: string,
    messageId: string,
    status: "sent" | "read",
    viewedBy?: any,
  ) => void;
  setUserOnline: (userId: string, isOnline: boolean) => void;
  setOnlineUsers: (userIds: string[]) => void;
  addTypingUser: (typing: TypingIndicator) => void;
  removeTypingUser: (roomId: string, userId: string) => void;
  updateRoomData: (updatedRoom: Room) => void;
  removeRoomFromList: (roomId: string) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  rooms: [],
  currentRoom: null,
  messages: {},
  pagination: {},
  onlineUsers: new Set(),
  typingUsers: [],
  isLoading: false,
  error: null,

  setRooms: (rooms) => set({ rooms }),

  setCurrentRoom: (room) => set({ currentRoom: room }),

  

  addMessage: (roomId, message) => {
    set((state) => {
      const roomMessages = state.messages[roomId] || [];

      const isDuplicate = roomMessages.some((m) => m._id === message._id);
      if (isDuplicate) return state;

      const updatedRooms = state.rooms.map(room => 
      room._id === roomId ? { ...room, lastMessage: message } : room
    );

      return {
        rooms: updatedRooms,
        messages: {
          ...state.messages,
          [roomId]: [...roomMessages, message],
        },
      };
    });
  },

  setMessages: (roomId, messages, page = 1, hasMore = true) => {
    set((state) => {
      const existingMessages = page > 1 ? state.messages[roomId] || [] : [];

      const newMessages =
        page > 1 ? [...messages, ...existingMessages] : messages;

      return {
        messages: {
          ...state.messages,
          [roomId]: newMessages,
        },
        pagination: {
          ...state.pagination,
          [roomId]: { page, hasMore },
        },
      };
    });
  },

  updateMessageStatus: (roomId, messageId, status, viewedBy) => {
    set((state) => {
      const roomMessages = [...(state.messages[roomId] || [])];
      const updated = roomMessages.map((m) => {
        if (m._id.toString() === messageId.toString()) {
          return {
            ...m,
            status: status,
            viewedBy: [...viewedBy],
          };
        }
        return m;
      });

      return {
        messages: {
          ...state.messages,
          [roomId]: updated,
        },
      };
    });
  },

  setUserOnline: (userId, isOnline) => {
    set((state) => {
      const newOnline = new Set(state.onlineUsers);
      if (isOnline) newOnline.add(userId);
      else newOnline.delete(userId);
      return { onlineUsers: newOnline };
    });
  },

  setOnlineUsers: (userIds) => set({ onlineUsers: new Set(userIds) }),

  addTypingUser: (typing) => {
    set((state) => {
      if (
        state.typingUsers.some(
          (u) => u.userId === typing.userId && u.roomId === typing.roomId,
        )
      ) {
        return state;
      }
      return { typingUsers: [...state.typingUsers, typing] };
    });
  },

  removeTypingUser: (roomId, userId) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        (u) => !(u.userId === userId && u.roomId === roomId),
      ),
    }));
  },

  updateRoomData: (updatedRoom: Room) => {
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r._id === updatedRoom._id ? updatedRoom : r,
      ),
      currentRoom:
        state.currentRoom?._id === updatedRoom._id
          ? updatedRoom
          : state.currentRoom,
    }));
  },
  removeRoomFromList: (roomId: string) => {
    set((state) => ({
      rooms: state.rooms.filter((r) => r._id !== roomId),
      currentRoom: state.currentRoom?._id === roomId ? null : state.currentRoom,
    }));
  },
}));
