import React from 'react';
import { UserGroupIcon } from 'hugeicons-react';

const EmptyState: React.FC = () => {
  return (
    <div className="chat-content" style={{ alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '1rem' }}>
          <UserGroupIcon size={64} style={{ opacity: 0.2 }} />
        </div>
        <h3>Select a chat to start messaging</h3>
      </div>
    </div>
  );
};

export default EmptyState;
