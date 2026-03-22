import React, { useState } from 'react';
import { UserAccountIcon, ViewIcon, ArrowLeft01Icon, ViewOffIcon } from 'hugeicons-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { useChatStore } from '../store/chatStore';
import { useNavigate } from 'react-router-dom';


const DEMO_USERS = [
  { username: 'Tundy', password: '1234567890', name: 'Tunde', userId: import.meta.env.VITE_TUNDY_USER_ID! },
  { username: 'Mekus', password: '1234567890', name: 'Emeka', userId: import.meta.env.VITE_MEKUS_USER_ID! },
  { username: 'Tanny', password: '1234567890', name: 'Tani', userId: import.meta.env.VITE_TANNY_USER_ID! },
  { username: 'Adaeze', password: '1234567890', name: 'Adaeze', userId: import.meta.env.VITE_ADAEZE_USER_ID! }
];



export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { onlineUsers } = useChatStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);

  const availableUsers = DEMO_USERS.filter(user => !onlineUsers.has(user.userId));

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });

      
      const { auth_token, userId, username: returnedUsername, displayPicture } = response.data;

      const userData = {
        _id: userId,
        username: returnedUsername,
        displayPicture: displayPicture,
        firstName: '',
        lastName: '',
      };

      login(userData as any, auth_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (user: typeof DEMO_USERS[0]) => {
    setUsername(user.username);
    setPassword(user.password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>
          <ArrowLeft01Icon size={18} /> Back
        </button>

        <h1>Welcome Back</h1>
        <p>Log in with your username</p>

        {error && <div style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem', background: 'rgba(248, 113, 113, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-wrapper">
              <i style={{ paddingTop: "0.5rem" }}><UserAccountIcon size={18} /></i>
              <input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label>Password</label>
            <div className="input-wrapper">
              <i style={{ paddingTop: "0.5rem", cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <ViewOffIcon size={18} /> : <ViewIcon size={18} />}</i>
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading} style={{ marginBottom: '1.5rem' }}>
            {isLoading ? 'Verifying...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
            Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Sign Up</span>
          </p>
        </form>
      </div>

      <div className="cheat-sheet">
        <h3>Quick Test (Demo user)</h3>
        <div className="demo-users">
          {availableUsers.length > 0 ? (
            availableUsers.map(user => (
              <button type='button' key={user.username} className="demo-user-btn" onClick={() => handleDemoLogin(user)}>
                <strong>@{user.username} {user.username === "Tundy" && "(Admin)"}</strong>
              </button>
            ))
          ) : (
            <div className="empty-state-card">
              <span>No users left to sign in.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
