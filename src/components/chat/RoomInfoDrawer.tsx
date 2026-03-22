import React from 'react';
import { ArrowLeft01Icon, UserGroupIcon, UserIcon, Share01Icon, Copy01Icon, Add01Icon, Loading01Icon, Delete01Icon, Logout01Icon } from 'hugeicons-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Room, User } from '../../types';
import { DemoUser } from '../../constant/demoUsers';

interface RoomInfoDrawerProps {
  showRoomInfo: boolean;
  setShowRoomInfo: (value: boolean) => void;
  currentRoom: Room;
  user: User | null;
  recipient: User | null;
  isEditing: boolean;
  editData: { name: string; roomBio: string; roomDisplayPicture: string };
  setEditData: (data: any) => void;
  isUpdating: boolean;
  handleUpdateGroup: (e: React.FormEvent) => void;
  handleStartEdit: () => void;
  setIsEditing: (value: boolean) => void;
  editFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showQR: boolean;
  setShowQR: (value: boolean) => void;
  inviteLink: string;
  copyToClipboard: () => void;
  copySuccess: boolean;
  memberSearch: string;
  setMemberSearch: (value: string) => void;
  searchMembers: (query: string) => void;
  memberSearchResults: User[];
  handleAddMember: (id: string) => void;
  isSearching: boolean;
  handleRemoveMember: (id: string) => void;
  handleLeaveGroup: () => void;
  isAdmin: boolean;
}

const RoomInfoDrawer: React.FC<RoomInfoDrawerProps> = ({
  showRoomInfo,
  setShowRoomInfo,
  currentRoom,
  user,
  recipient,
  isEditing,
  editData,
  setEditData,
  isUpdating,
  handleUpdateGroup,
  handleStartEdit,
  setIsEditing,
  editFileInputRef,
  handleImageUpload,
  showQR,
  setShowQR,
  inviteLink,
  copyToClipboard,
  copySuccess,
  memberSearch,
  searchMembers,
  memberSearchResults,
  handleAddMember,
  isSearching,
  handleRemoveMember,
  handleLeaveGroup,
  isAdmin,
}) => {
  return (
    <div className={`info-drawer ${showRoomInfo ? 'open' : ''}`}>
      <div className="info-drawer-header">
        <button title='close' onClick={() => setShowRoomInfo(false)}><ArrowLeft01Icon size={20} /></button>
        <h3>{currentRoom.roomType === 'group' ? 'Group Info' : 'Contact Info'}</h3>
      </div>
      <div className="info-drawer-content" style={{ textAlign: 'center' }}>
        {isEditing ? (
          <form onSubmit={handleUpdateGroup} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                onClick={() => editFileInputRef.current?.click()}
                style={{ width: '80px', height: '80px', margin: '0 auto', borderRadius: '50%', background: '#334155', cursor: 'pointer', overflow: 'hidden' }}
              >
                <img src={editData.roomDisplayPicture || '/default-group.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt='group-dp' />
              </div>
              <input disabled={DemoUser.some(userId => userId === user?._id)} type="file" ref={editFileInputRef} hidden onChange={handleImageUpload} />
            </div>

            <div className="input-group">
              <label>Name</label>
              <div className="input-wrapper">
                <input title='group-name' type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} required />
              </div>
            </div>

            <div className="input-group">
              <label>Bio</label>
              <div className="input-wrapper">
                <textarea title='group-bio' value={editData.roomBio} onChange={(e) => setEditData({ ...editData, roomBio: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="primary-btn" disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: '1px solid #334155', color: 'white', padding: '0.75rem', borderRadius: '8px' }}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#334155', margin: '0 auto 1rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentRoom.roomType === 'group'
                  ? (currentRoom.roomDisplayPicture ? <img title='room dp' src={currentRoom.roomDisplayPicture} /> : <UserGroupIcon size={48} />)
                  : (recipient?.displayPicture ? <img title='member dp' src={recipient.displayPicture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={48} />)
                }
              </div>
              <h2 style={{ margin: '0 0 0.25rem' }}>{currentRoom.name || recipient?.username}</h2>
              {currentRoom.roomType === 'private' && (
                <p style={{ color: '#94a3b8', margin: 0 }}>{recipient?.firstName} {recipient?.lastName}</p>
              )}
            </div>

            <hr style={{ borderColor: '#334155', margin: '1.5rem 0' }} />
            {currentRoom.roomType === 'group' && (
              <>
                {isAdmin && (
                  <button onClick={handleStartEdit} style={{ marginTop: '0.5rem', background: '#3b82f622', color: '#3b82f6', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                    Edit Group
                  </button>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                  <h4 style={{ color: '#64748b', marginBottom: '1rem' }}>About</h4>
                  <p style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>{currentRoom.roomBio ? currentRoom.roomBio : "No Bio Available"}</p>
                </div>

                <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #334155', textAlign: 'left' }}>
                  <h4 style={{ color: '#64748b', marginBottom: '1rem' }}>Invite Friends</h4>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => setShowQR(true)}
                      style={{ flex: 1, padding: '0.6rem', background: '#334155', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Share01Icon size={18} /> QR Code
                    </button>
                    <button
                      onClick={copyToClipboard}
                      style={{ flex: 1, padding: '0.6rem', background: copySuccess ? '#22c55e' : '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Copy01Icon size={18} /> {copySuccess ? 'Copied' : 'Link'}
                    </button>
                  </div>
                </div>

                {isAdmin && (
                  <div style={{ padding: '1rem 0', textAlign: 'left' }}>
                    <h4 style={{ color: '#64748b', marginBottom: '0.5rem' }}>Add Member</h4>
                    <div className="input-wrapper" style={{ background: '#0f172a' }}>
                      <input
                        type="text"
                        placeholder="Search by username..."
                        value={memberSearch}
                        disabled={DemoUser.some(userId => userId === user?._id)}
                        onChange={(e) => searchMembers(e.target.value)}
                      />
                    </div>
                    {memberSearchResults.length > 0 && (
                      <div style={{ background: '#1e293b', borderRadius: '8px', marginTop: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                        {memberSearchResults.map(u => (
                          <div key={u._id} onClick={() => handleAddMember(u._id)} style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid #334155' }}>
                            <span>@{u.username}</span>
                            <Add01Icon size={18} color="#3b82f6" />
                          </div>
                        ))}
                      </div>
                    )}
                    {isSearching && <Loading01Icon size={16} />}
                  </div>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                  <h4 style={{ color: '#64748b', marginBottom: '1rem' }}>{`Members (${currentRoom.roomMembers.length})`}</h4>
                  {(currentRoom?.roomMembers as User[]).map(member => (
                    <div key={member._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {member.displayPicture ? <img title="display-picture" src={member.displayPicture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={16} />}
                        </div>
                        <span style={{ fontSize: '0.9rem' }}>
                          {member.username} {member._id === user?._id ? '(You)' : ''}
                          {member._id === currentRoom?.creator && <span style={{ fontSize: '0.7rem', color: '#3b82f6', marginLeft: '5px' }}>Admin</span>}
                        </span>
                      </div>
                      {isAdmin && member._id !== user?._id && (
                        <button title='remove-member' onClick={() => handleRemoveMember(member._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Delete01Icon size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleLeaveGroup}
                  style={{ width: '100%', marginTop: '2rem', padding: '0.75rem', borderRadius: '8px', background: '#dc262622', color: '#ef4444', border: '1px solid #ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Logout01Icon size={18} /> Leave Group
                </button>

                {showQR && (
                  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '1.5rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                      <h3 style={{ marginBottom: '1.5rem' }}>Group QR Code</h3>
                      <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block', marginBottom: '1.5rem' }}>
                        <QRCodeSVG value={inviteLink} size={200} />
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Anyone with this QR code can join the group.</p>
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={() => setShowQR(false)}
                        style={{ width: '100%' }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoomInfoDrawer;
