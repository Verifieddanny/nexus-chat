import React from 'react';
import { ArrowLeft01Icon, UserGroupIcon, UserIcon, InformationCircleIcon } from 'hugeicons-react';
import type { Room, User } from '../../types';

interface ChatHeaderProps {
  currentRoom: Room;
  recipient: User | null;
  onlineUsers: Set<string>;
  getTypingText: () => string | null;
  setCurrentRoom: (room: Room | null) => void;
  setShowRoomInfo: (value: boolean) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentRoom,
  recipient,
  onlineUsers,
  getTypingText,
  setCurrentRoom,
  setShowRoomInfo,
}) => {
  return (
    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          title='back'
          className="mobile-only"
          onClick={() => setCurrentRoom(null)}
          style={{ background: 'transparent', border: 'none', color: 'white', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft01Icon size={24} />
        </button>

        <div style={{ position: 'relative' }}>
          <div style={{ width: '40px', height: '40px', background: '#334155', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {currentRoom.roomType === 'group'
              ? (currentRoom.roomDisplayPicture ? <img src={currentRoom.roomDisplayPicture} alt="Room" /> : <UserGroupIcon size={20} />)
              : (recipient?.displayPicture ? <img src={recipient.displayPicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={20} />)
            }
          </div>
          {recipient && onlineUsers.has(recipient._id) && (
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', border: '2px solid #1e293b' }} />
          )}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>
            {currentRoom.name || (recipient ? `${recipient.username}` : 'Chat')}
          </div>
          <div style={{ fontSize: '0.75rem', color: recipient && onlineUsers.has(recipient._id) ? '#22c55e' : '#94a3b8' }}>
            {getTypingText() || (currentRoom.roomType === 'group' ? 'Group' : (onlineUsers.has(recipient?._id || "") ? 'Online' : 'Offline'))}
          </div>
        </div>
      </div>
      <InformationCircleIcon
        size={20}
        style={{ color: '#64748b', cursor: 'pointer' }}
        onClick={() => setShowRoomInfo(true)}
      />
    </div>
  );
};

export default ChatHeader;
