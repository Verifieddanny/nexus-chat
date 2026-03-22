import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { connectSocket, disconnectSocket } from '../services/socket';
import api from '../services/api';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';

export const ChatLayout: React.FC = () => {
  const { token, fetchProfile } = useAuthStore();
  const { setRooms, currentRoom } = useChatStore();

  useEffect(() => {
    if (token) {
      fetchProfile();

      connectSocket(token);

      const fetchRooms = async () => {
        try {
          const response = await api.get('/rooms/all');

          const roomsData = response.data.rooms;
          setRooms(Array.isArray(roomsData) ? roomsData : []);
        } catch (err) {
          console.error('Failed to fetch rooms:', err);
        }
      };

      fetchRooms();

      return () => {
        disconnectSocket();
      };
    }
  }, [token, setRooms]);

  return (
    <div className="chat-layout">
      <div className={currentRoom ? 'hidden-mobile sidebar' : 'sidebar'}>
        <Sidebar />
      </div>
      <div className={!currentRoom ? 'hidden-mobile chat-content' : 'chat-content'}>
        <ChatWindow />
      </div>
    </div>
  );
};
