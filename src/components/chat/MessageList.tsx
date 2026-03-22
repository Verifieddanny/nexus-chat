import React from 'react';
import { Tick01Icon, TickDouble01Icon, UserIcon, MoreHorizontalIcon, Copy01Icon, InformationCircleIcon } from 'hugeicons-react';
import type { Message, Room, User } from '../../types';
import { renderMessageContent } from '../../helper/renderMessageContent';
import { getUsernameColor } from '../../helper/getUsernameColor';

interface MessageItemProps {
  msg: Message;
  user: User | null;
  currentRoom: Room;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  handleCopyMessage: (text: string) => void;
  handleMessageInfo: (msg: Message) => void;
  handleJoinViaLink: (roomId: string) => void;
  startPress: (msgId: string) => void;
  endPress: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  msg,
  user,
  currentRoom,
  activeMenuId,
  setActiveMenuId,
  handleCopyMessage,
  handleMessageInfo,
  handleJoinViaLink,
  startPress,
  endPress,
}) => {
  const isOwn = (typeof msg.from === 'string' ? msg.from : msg.from._id) === user?._id;
  const isMenuOpen = activeMenuId === msg._id;
  const sender = typeof msg.from === 'object' ? msg.from : null;
  const showSenderInfo = !isOwn && currentRoom.roomType === 'group';
  const nameColor = sender?._id ? getUsernameColor(sender._id) : '#60a5fa';

  return (
    <div
      className="message-wrapper"
      style={{
        alignSelf: isOwn ? 'flex-end' : 'flex-start',
        maxWidth: '75%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseDown={() => startPress(msg._id)}
      onMouseUp={endPress}
      onTouchStart={() => startPress(msg._id)}
      onTouchEnd={endPress}
    >
      <div
        className={`message-bubble ${isOwn ? 'own' : 'other'}`}
        style={{
          background: isOwn ? '#3b82f6' : '#1e293b',
          padding: '0.6rem 0.8rem 0.4rem 0.8rem',
          borderRadius: isOwn ? '1rem 1rem 0 1rem' : '0 1rem 1rem 1rem',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        {showSenderInfo && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem',
            paddingRight: '1rem'
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#334155',
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {sender?.displayPicture ? (
                <img src={sender.displayPicture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <UserIcon size={12} />
              )}
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: nameColor,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              filter: 'brightness(1.2)'
            }}>
              {sender?.username || 'Unknown'}
            </span>
          </div>
        )}

        <div
          className="message-caret"
          onClick={(e) => { e.stopPropagation(); setActiveMenuId(isMenuOpen ? null : msg._id); }}
        >
          <MoreHorizontalIcon size={14} />
        </div>
        {renderMessageContent(msg.content, handleJoinViaLink)}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.25rem',
          fontSize: '0.7rem',
          marginTop: '0.25rem',
          color: isOwn ? 'rgba(255,255,255,0.7)' : '#64748b'
        }}>
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isOwn && (
            msg.viewedBy.length === 0 ? (
              <Tick01Icon size={18} />
            ) : currentRoom.roomType === 'private' || (msg.viewedBy.length / (currentRoom.roomMembers.length) > 0.6) ? (
              <TickDouble01Icon size={18} color="#ffffff" fontSize="bold" />
            ) : (
              <TickDouble01Icon size={18} />
            )
          )}
        </div>
        {isMenuOpen && (
          <>
            <div className="menu-backdrop" onClick={() => setActiveMenuId(null)} />
            <div className={`message-context-menu ${isOwn ? 'menu-right' : 'menu-left'}`}>
              <button type='button' onClick={() => handleCopyMessage(msg.content)}>
                <Copy01Icon size={16} /> Copy Text
              </button>
              {isOwn && (
                <button type='button' onClick={() => handleMessageInfo(msg)}>
                  <InformationCircleIcon size={16} /> Message Info
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface MessageListProps {
  roomMessages: Message[];
  user: User | null;
  currentRoom: Room;
  isFetchingMore: boolean;
  activeMenuId: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  setActiveMenuId: (id: string | null) => void;
  handleCopyMessage: (text: string) => void;
  handleMessageInfo: (msg: Message) => void;
  handleJoinViaLink: (roomId: string) => void;
  startPress: (msgId: string) => void;
  endPress: () => void;
  getTypingText: () => string | null;
}

const MessageList: React.FC<MessageListProps> = ({
  roomMessages,
  user,
  currentRoom,
  isFetchingMore,
  activeMenuId,
  scrollContainerRef,
  messagesEndRef,
  handleScroll,
  setActiveMenuId,
  handleCopyMessage,
  handleMessageInfo,
  handleJoinViaLink,
  startPress,
  endPress,
  getTypingText,
}) => {
  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      {isFetchingMore && <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>Loading previous messages...</div>}
      {roomMessages.map((msg) => (
        <MessageItem
          key={msg._id}
          msg={msg}
          user={user}
          currentRoom={currentRoom}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          handleCopyMessage={handleCopyMessage}
          handleMessageInfo={handleMessageInfo}
          handleJoinViaLink={handleJoinViaLink}
          startPress={startPress}
          endPress={endPress}
        />
      ))}
      {getTypingText() && <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>{getTypingText()}</div>}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
