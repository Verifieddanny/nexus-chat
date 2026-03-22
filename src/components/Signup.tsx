import React, { useState, useRef } from 'react';
import { Mail01Icon, ViewIcon, UserIcon, UserAccountIcon, Camera01Icon, ViewOffIcon, } from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { uploadToCDN } from '../helper/uploadToCDN';
import { toast } from 'sonner';


export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    displayPicture: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
    }
  };


  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let finalDisplayPic = '';
      if (imageFile) {
        finalDisplayPic = await uploadToCDN(imageFile, previewUrl, setIsUploading);
      }

      const submissionData = {
        ...formData,
        displayPicture: finalDisplayPic
      };

      await api.post('/auth/sign-up', submissionData);
      toast.success('Signup Success! Welcome to NexusChat.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Failed to join NexusChat.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '450px' }}>
        <h1>Create Account</h1>
        <p>Join the real-time messaging community</p>

        {error && <div style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem', background: 'rgba(248, 113, 113, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '80px', height: '80px', background: '#0f172a', borderRadius: '50%', border: '2px dashed #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
            >
              {previewUrl ? <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera01Icon size={24} color="#64748b" />}
            </div>
            <label style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Profile Picture</label>
            <input title='display picture' type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>First Name</label>
              <div className="input-wrapper">
                <i style={{ paddingTop: "0.5rem" }}><UserIcon size={16} /></i>
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
              </div>
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <div className="input-wrapper">
                <i style={{ paddingTop: "0.5rem" }}><UserIcon size={16} /></i>
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Username</label>
            <div className="input-wrapper">
              <i style={{ paddingTop: "0.5rem" }}><UserAccountIcon size={18} /></i>
              <input type="text" name="username" placeholder="johndoe" value={formData.username} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <i style={{ paddingTop: "0.5rem" }}><Mail01Icon size={18} /></i>
              <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <i style={{ paddingTop: "0.5rem", cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <ViewOffIcon size={18} /> : <ViewIcon size={18} />}</i>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading || isUploading} style={{ marginBottom: '1.25rem' }}>
            {isUploading ? 'Uploading Image...' : (isLoading ? 'Joining...' : 'Sign Up')}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
            Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Sign In</span>
          </p>
        </form>
      </div>
    </div>
  );
};
