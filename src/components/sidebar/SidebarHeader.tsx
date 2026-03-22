import React from 'react';
import { Logout01Icon, UserIcon } from 'hugeicons-react';
import type { User } from '../../types';

interface SidebarHeaderProps {
  user: User | null;
  logout: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ user, logout }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user?.displayPicture ? <img src={user.displayPicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={20} />}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{user?.firstName || 'User'}</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>@{user?.username}</div>
        </div>
      </div>
      <button title='logout' onClick={logout} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
        <Logout01Icon size={20} />
      </button>
    </div>
  );
};

export default SidebarHeader;
