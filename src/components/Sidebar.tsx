import React, { useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import type { User } from '../types';
import api from '../services/api';
import { uploadToCDN } from '../helper/uploadToCDN';
import { getSocket } from '../services/socket';

import SidebarHeader from './sidebar/SidebarHeader';
import SearchBar from './sidebar/SearchBar';
import RoomList from './sidebar/RoomList';
import CreateGroupOverlay from './sidebar/CreateGroupOverlay';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { rooms, currentRoom, setCurrentRoom, setRooms } = useChatStore();
  const [search, setSearch] = useState('');
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupData, setGroupData] = useState({ name: '', roomBio: '', roomDisplayPicture: '' });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
    }
  };

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (query.length > 2) {
      setIsSearchingUsers(true);
      try {
        const response = await api.get(`/auth/users?search=${query}`);
        setSearchResults(Array.isArray(response.data.userFound) ? response.data.userFound : []);
      } catch (err) {
        console.error('Search failed:', err);
      }
    } else {
      setIsSearchingUsers(false);
      setSearchResults([]);
    }
  };

  const createPrivateChat = async (targetUser: User) => {
    try {
      const response = await api.post('/rooms', {
        roomType: 'private',
        recipientId: targetUser._id
      });

      const newRoomId = response.data.roomId;
      const socket = getSocket();
      if (socket) {
        socket.emit('client:join_room', { roomId: newRoomId });
      }

      const updatedResponse = await api.get('/rooms/all');
      const allRooms = updatedResponse.data.rooms;
      setRooms(allRooms);

      const newRoom = allRooms.find((r: any) => r._id === newRoomId);
      if (newRoom) setCurrentRoom(newRoom);

      setSearch('');
      setIsSearchingUsers(false);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleCreateGroup = async (e: React.SubmitEvent) => {
    e.preventDefault();

    let finalDisplayPic = '';
    if (imageFile) {
      finalDisplayPic = await uploadToCDN(imageFile, previewUrl, setIsUploading);
    }

    const submissionData = {
      ...groupData,
      roomDisplayPicture: finalDisplayPic
    };

    try {
      const response = await api.post('/rooms', { ...submissionData, roomType: 'group' });
      const newRoomId = response.data.roomId;

      const socket = getSocket();
      if (socket) {
        socket.emit('client:join_room', { roomId: newRoomId });
      }

      const updatedResponse = await api.get('/rooms/all');
      setRooms(updatedResponse.data.rooms);

      setIsCreatingGroup(false);
      setGroupData({ name: '', roomBio: '', roomDisplayPicture: '' });
      setPreviewUrl(null);
      setImageFile(null);
    } catch (err) {
      console.error('Group creation failed:', err);
    }
  };

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {isCreatingGroup && (
        <CreateGroupOverlay
          setIsCreatingGroup={setIsCreatingGroup}
          handleCreateGroup={handleCreateGroup}
          groupData={groupData}
          setGroupData={setGroupData}
          previewUrl={previewUrl}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          isUploading={isUploading}
        />
      )}

      <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
        <SidebarHeader user={user} logout={logout} />
        <SearchBar search={search} user={user} handleSearch={handleSearch} />
      </div>

      <RoomList
        isSearchingUsers={isSearchingUsers}
        searchResults={searchResults}
        rooms={rooms}
        currentRoom={currentRoom}
        user={user}
        createPrivateChat={createPrivateChat}
        setCurrentRoom={setCurrentRoom}
        setIsCreatingGroup={setIsCreatingGroup}
      />
    </div>
  );
};
