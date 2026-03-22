import React from 'react';
import { Cancel01Icon, Camera01Icon } from 'hugeicons-react';

interface CreateGroupOverlayProps {
  setIsCreatingGroup: (value: boolean) => void;
  handleCreateGroup: (e: React.SubmitEvent) => void;
  groupData: { name: string; roomBio: string; roomDisplayPicture: string };
  setGroupData: (data: any) => void;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

const CreateGroupOverlay: React.FC<CreateGroupOverlayProps> = ({
  setIsCreatingGroup,
  handleCreateGroup,
  groupData,
  setGroupData,
  previewUrl,
  fileInputRef,
  handleFileChange,
  isUploading,
}) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#0f172a', zIndex: 100, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Create Group</h2>
        <button type='button' title='cancel' onClick={() => setIsCreatingGroup(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
          <Cancel01Icon size={24} />
        </button>
      </div>
      <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ width: '80px', height: '80px', background: '#0f172a', borderRadius: '50%', border: '2px dashed #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
          >
            {previewUrl ? <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera01Icon size={24} color="#64748b" />}
          </div>
          <label style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Group Picture</label>
          <input title='display picture' type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
        </div>

        <div className="input-group">
          <label>Group Name</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="The Squad"
              value={groupData.name}
              onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label>Bio (Optional)</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="What's this group about?"
              value={groupData.roomBio}
              onChange={(e) => setGroupData({ ...groupData, roomBio: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="primary-btn">
          {isUploading ? 'Uploading Image...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
};

export default CreateGroupOverlay;
