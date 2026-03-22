import React from 'react';
import { ArrowLeft01Icon, UserIcon } from 'hugeicons-react';
import type { Message, User } from '../../types';

interface MessageInfoDrawerProps {
  infoMessage: Message | null;
  setInfoMessage: (msg: Message | null) => void;
}

const MessageInfoDrawer: React.FC<MessageInfoDrawerProps> = ({
  infoMessage,
  setInfoMessage,
}) => {
  return (
    <div className={`info-drawer ${infoMessage ? 'open' : ''}`}>
      <div className="info-drawer-header">
        <button title='close' onClick={() => setInfoMessage(null)}><ArrowLeft01Icon size={20} /></button>
        <h3>Message Info</h3>
      </div>
      <div className="info-drawer-content">
        <div className="info-message-preview">
          <p>{infoMessage?.content}</p>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {infoMessage && new Date(infoMessage.createdAt).toLocaleString([], {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </span>
        </div>

        <div className="viewed-section">
          <h4 style={{ marginBottom: '1rem', color: '#64748b' }}>Read by</h4>
          {infoMessage?.viewedBy.map((view, index) => {
            const viewer = view.user as User;
            return (
              <div key={index} className="view-item" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="view-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', overflow: 'hidden' }}>
                  {viewer.displayPicture ? <img title='display picture' src={viewer.displayPicture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={16} />}
                </div>
                <div className="view-details">
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{viewer.username || 'Unknown User'}</p>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {new Date(view.read).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageInfoDrawer;
