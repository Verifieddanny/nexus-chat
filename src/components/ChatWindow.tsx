import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { getSocket } from '../services/socket';
import api from '../services/api';
import type { Message, User } from '../types';
import "./styles/ChatWIndow.css";
import { uploadToCDN } from '../helper/uploadToCDN';

import EmptyState from './chat/EmptyState';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import MessageInfoDrawer from './chat/MessageInfoDrawer';
import RoomInfoDrawer from './chat/RoomInfoDrawer';

export const ChatWindow: React.FC = () => {
  const { user } = useAuthStore();
  const { currentRoom, setRooms, setCurrentRoom, messages, setMessages, typingUsers, onlineUsers, updateRoomData, removeRoomFromList } = useChatStore();
  const [content, setContent] = useState('');
  const [infoMessage, setInfoMessage] = useState<Message | null>(null);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberSearchResults, setMemberSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', roomBio: '', roomDisplayPicture: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<number | null>(null);

  const isAdmin = currentRoom?.creator === user?._id;
  const inviteLink = `${window.location.origin}/join/${currentRoom?._id}`;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const roomMessages = currentRoom ? messages[currentRoom._id] || [] : [];
  const currentTyping = currentRoom ? typingUsers.filter(u => u.roomId === currentRoom._id && u.userId !== user?._id) : [];

  useEffect(() => {
    if (currentRoom) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(`/messages/${currentRoom._id}?page=1`);
          const history = response.data.messages;
          setMessages(currentRoom._id, Array.isArray(history) ? [...history].reverse() : []);
        } catch (err) {
          toast.error("Failed to fetch messages")
        }
      };
      fetchMessages();
    }
  }, [currentRoom, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length]);

  useEffect(() => {
    if (!currentRoom || roomMessages.length === 0) return;

    const socket = getSocket();
    if (!socket) return;

    const unreadMessages = roomMessages.filter(msg => {
      const fromId = typeof msg.from === 'string' ? msg.from : msg.from._id;
      const isOwn = fromId === user?._id;

      const alreadyRead = msg.viewedBy.some(v => {
        const viewerId = typeof v.user === 'string' ? v.user : v.user?._id;
        return viewerId === user?._id;
      });

      return !isOwn && !alreadyRead;
    });

    if (unreadMessages.length === 0) return;

    unreadMessages.forEach(msg => {
      socket.emit('client:read_receipt', {
        messageId: msg._id,
        roomId: currentRoom._id
      });

      const optimisticViewer = {
        user: {
          _id: user?._id || "",
          username: user?.username || "",
          displayPicture: user?.displayPicture || ""
        },
        read: new Date().toISOString()
      };

      useChatStore.getState().updateMessageStatus(
        currentRoom._id,
        msg._id,
        'read',
        [...msg.viewedBy, optimisticViewer]
      );
    });
  }, [currentRoom?._id, roomMessages.length, user?._id]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("server:group_updated", async (data: { roomId: string }) => {
      if (currentRoom?._id === data.roomId) {
        const res = await api.get(`/rooms/${data.roomId}`);
        updateRoomData(res.data.activeRoom);
      }
    });

    return () => { socket.off("server:group_updated"); };
  }, [currentRoom?._id, updateRoomData]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentRoom) return;

    const socket = getSocket();
    if (socket) {
      socket.emit('client:send_message', {
        roomId: currentRoom._id,
        content: content.trim()
      });
      setContent('');
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    const socket = getSocket();
    if (socket && currentRoom) {
      socket.emit('client:is_typing', {
        roomId: currentRoom._id
      });
    }
  };

  const handleScroll = async () => {
    const container = scrollContainerRef.current;
    if (!container || !currentRoom || isFetchingMore) return;

    if (container.scrollTop === 0) {
      const currentPage = useChatStore.getState().pagination[currentRoom._id]?.page || 1;
      const hasMore = useChatStore.getState().pagination[currentRoom._id]?.hasMore ?? true;

      if (hasMore) {
        setIsFetchingMore(true);
        const previousHeight = container.scrollHeight;
        try {
          const nextPage = currentPage + 1;
          const response = await api.get(`/messages/${currentRoom._id}?page=${nextPage}`);
          const newMessages = response.data.messages;

          useChatStore.getState().setMessages(
            currentRoom._id,
            Array.isArray(newMessages) ? [...newMessages].reverse() : [],
            nextPage,
            newMessages.length === 15
          );

          setTimeout(() => {
            container.scrollTop = container.scrollHeight - previousHeight;
          }, 0);
        } catch (err) {
          toast.error("Failed to load more messages")
        } finally {
          setIsFetchingMore(false);
        }
      }
    }
  };

  const searchMembers = async (query: string) => {
    setMemberSearch(query);
    if (query.length < 2) return setMemberSearchResults([]);
    setIsSearching(true);
    try {
      const res = await api.get(`/auth/users?search=${query}`);
      const filtered = res.data.userFound.filter(
        (u: User) => !currentRoom?.roomMembers.some((m: any) => (typeof m === 'string' ? m : m._id) === u._id)
      );
      setMemberSearchResults(filtered);
    } catch (err) { console.error(err); }
    finally { setIsSearching(false); }
  };

  const handleAddMember = async (targetUserId: string) => {
    try {
      const res = await api.put(`/rooms/${currentRoom?._id}/add`, { recipientId: targetUserId });
      updateRoomData(res.data.updatedRoom);
      getSocket()?.emit("client:group_update", { roomId: currentRoom?._id, updateType: 'member_added' });
      toast.success("Member added successfully");
      setMemberSearch('');
      setMemberSearchResults([]);
    } catch (err) { toast.error("Failed to add member"); }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Remove this user from the group?")) return;
    try {
      await api.put(`/rooms/${currentRoom?._id}/remove`, { recipientId: memberId });
      const res = await api.get(`/rooms/${currentRoom?._id}`);
      updateRoomData(res.data.activeRoom);
      getSocket()?.emit("client:group_update", { roomId: currentRoom?._id, updateType: 'member_removed' });
    } catch (err) { toast.error("Failed to remove member") }
  };

  const handleLeaveGroup = async () => {
    if (!confirm("Are you sure you want to leave?")) return;
    try {
      await api.put(`/rooms/${currentRoom?._id}/leave`);
      getSocket()?.emit("client:group_update", { roomId: currentRoom?._id, updateType: 'left' });
      removeRoomFromList(currentRoom!._id);
      toast.info("You left the group");
    } catch (err) { toast.error("Failed to leave group"); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopySuccess(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copied to clipboard");
    setActiveMenuId(null);
  };

  const handleMessageInfo = (msg: Message) => {
    setInfoMessage(msg);
    setActiveMenuId(null);
  };

  const startPress = (msgId: string) => {
    longPressTimer.current = window.setTimeout(() => {
      setActiveMenuId(msgId);
    }, 500);
  };

  const endPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleJoinViaLink = async (roomId: string) => {
    const existingRoom = useChatStore.getState().rooms.find(r => r._id === roomId);
    if (existingRoom) {
      setCurrentRoom(existingRoom);
      return;
    }

    const promise = async () => {
      await api.put(`/rooms/${roomId}/join`);
      const response = await api.get('/rooms/all');
      setRooms(response.data.rooms);
      const joinedRoom = response.data.rooms.find((r: any) => r._id === roomId);
      if (joinedRoom) setCurrentRoom(joinedRoom);
      const socket = getSocket();
      if (socket) {
        socket.emit("client:group_update", { roomId, updateType: 'join' });
      }
    };

    toast.promise(promise(), {
      loading: 'Joining group...',
      success: 'Successfully joined!',
      error: (err) => err.response?.data?.message || 'Failed to join group',
    });
  };

  const handleStartEdit = () => {
    setEditData({
      name: currentRoom?.name || '',
      roomBio: currentRoom?.roomBio || '',
      roomDisplayPicture: currentRoom?.roomDisplayPicture || ''
    });
    setIsEditing(true);
  };

  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await api.put(`/rooms/${currentRoom?._id}`, editData);
      updateRoomData(res.data.updatedRoom);
      getSocket()?.emit("client:group_update", {
        roomId: currentRoom?._id,
        updateType: 'group_update'
      });
      toast.success("Group details updated!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update group");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadToCDN(file, null, setIsUpdating);
      setEditData({ ...editData, roomDisplayPicture: url });
    }
  };

  const getTypingText = () => {
    if (currentTyping.length === 0) return null;
    if (currentRoom?.roomType === 'private') return 'typing...';
    if (currentTyping.length === 1) return `${currentTyping[0].username} is typing...`;
    if (currentTyping.length === 2) return `${currentTyping[0].username} and ${currentTyping[1].username} are typing...`;
    return `${currentTyping[0].username} and ${currentTyping.length - 1} others are typing...`;
  };

  if (!currentRoom) return <EmptyState />;

  const recipient = currentRoom.roomType === 'private'
    ? (currentRoom.roomMembers as User[]).find(m => m._id !== user?._id)
    : null;

  return (
    <div className="chat-content" style={{ maxHeight: "100dvh" }}>
      <ChatHeader
        currentRoom={currentRoom}
        recipient={recipient || null}
        onlineUsers={onlineUsers}
        getTypingText={getTypingText}
        setCurrentRoom={setCurrentRoom}
        setShowRoomInfo={setShowRoomInfo}
      />

      <MessageList
        roomMessages={roomMessages}
        user={user}
        currentRoom={currentRoom}
        isFetchingMore={isFetchingMore}
        activeMenuId={activeMenuId}
        scrollContainerRef={scrollContainerRef}
        messagesEndRef={messagesEndRef}
        handleScroll={handleScroll}
        setActiveMenuId={setActiveMenuId}
        handleCopyMessage={handleCopyMessage}
        handleMessageInfo={handleMessageInfo}
        handleJoinViaLink={handleJoinViaLink}
        startPress={startPress}
        endPress={endPress}
        getTypingText={getTypingText}
      />

      <MessageInput
        content={content}
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
      />

      <MessageInfoDrawer
        infoMessage={infoMessage}
        setInfoMessage={setInfoMessage}
      />

      <RoomInfoDrawer
        showRoomInfo={showRoomInfo}
        setShowRoomInfo={setShowRoomInfo}
        currentRoom={currentRoom}
        user={user}
        recipient={recipient || null}
        isEditing={isEditing}
        editData={editData}
        setEditData={setEditData}
        isUpdating={isUpdating}
        handleUpdateGroup={handleUpdateGroup}
        handleStartEdit={handleStartEdit}
        setIsEditing={setIsEditing}
        editFileInputRef={editFileInputRef}
        handleImageUpload={handleImageUpload}
        showQR={showQR}
        setShowQR={setShowQR}
        inviteLink={inviteLink}
        copyToClipboard={copyToClipboard}
        copySuccess={copySuccess}
        memberSearch={memberSearch}
        setMemberSearch={setMemberSearch}
        searchMembers={searchMembers}
        memberSearchResults={memberSearchResults}
        handleAddMember={handleAddMember}
        isSearching={isSearching}
        handleRemoveMember={handleRemoveMember}
        handleLeaveGroup={handleLeaveGroup}
        isAdmin={isAdmin}
      />

      {(infoMessage || showRoomInfo) && (
        <div className="drawer-backdrop" onClick={() => { setInfoMessage(null); setShowRoomInfo(false); }} />
      )}
    </div>
  );
};
