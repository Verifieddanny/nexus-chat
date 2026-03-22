import React from 'react';
import { Add01Icon, UserGroupIcon, UserIcon } from 'hugeicons-react';
import type { User, Room } from '../../types';

interface RoomListProps {
  isSearchingUsers: boolean;
  searchResults: User[];
  rooms: Room[];
  currentRoom: Room | null;
  user: User | null;
  createPrivateChat: (targetUser: User) => void;
  setCurrentRoom: (room: Room) => void;
  setIsCreatingGroup: (value: boolean) => void;
}

const RoomList: React.FC<RoomListProps> = ({
  isSearchingUsers,
  searchResults,
  rooms,
  currentRoom,
  user,
  createPrivateChat,
  setCurrentRoom,
  setIsCreatingGroup,
}) => {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
      {isSearchingUsers ? (
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', paddingLeft: '0.5rem' }}>Global Search</div>
          {searchResults.map((u) => (
            <div key={u._id} onClick={() => createPrivateChat(u)} className="room-item" style={{ padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', background: '#334155' }}>
              <div style={{ width: '32px', height: '32px', background: '#1e293b', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {u.displayPicture ? <img src={u.displayPicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={16} />}
              </div>
              <div style={{ fontSize: '0.9rem' }}>@{u.username}</div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', paddingLeft: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            CHATS
            <button onClick={() => setIsCreatingGroup(true)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 700 }}>
              <Add01Icon size={14} /> NEW GROUP
            </button>
          </div>
          {Array.isArray(rooms) && [...rooms]
            .sort((a, b) => {
              const timeA = a.lastMessage
                ? new Date(a.lastMessage.createdAt).getTime()
                : new Date(a.createdAt).getTime();
              const timeB = b.lastMessage
                ? new Date(b.lastMessage.createdAt).getTime()
                : new Date(b.createdAt).getTime();
              return timeB - timeA;
            }).map((room) => {
              const recipient = room.roomType === 'private'
                ? (room.roomMembers as User[]).find(m => m._id !== user?._id)
                : null;
              return (
                <div key={room._id} onClick={() => setCurrentRoom(room)} style={{ padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', background: currentRoom?._id === room._id ? '#3b82f6' : 'transparent' }}>
                  <div style={{ width: '40px', height: '40px', background: '#334155', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {room.roomType === 'group'
                      ? (room.roomDisplayPicture ? <img src={room.roomDisplayPicture} alt="Room" /> : <UserGroupIcon size={20} />)
                      : (recipient?.displayPicture ? <img src={recipient.displayPicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={20} />)
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {room.name || (recipient ? `@${recipient.username}` : 'Chat')}
                      </span>
                      {room.lastMessage && (
                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 400 }}>
                          {new Date(room.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {room.lastMessage ? (
                        <>
                          {room.roomType === 'group' && (
                            <span style={{ color: '#3b82f6', marginRight: '4px' }}>
                              {typeof room.lastMessage.from === 'object' ? room.lastMessage.from.username : 'User'}:
                            </span>
                          )}
                          {room.lastMessage.content}
                        </>
                      ) : (
                        <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No messages yet</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default RoomList;
