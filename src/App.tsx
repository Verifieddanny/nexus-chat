import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'sonner';
import { Landing } from './components/Landing';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ChatLayout } from './components/ChatLayout';
import { JoinGroup } from './components/JoinGroup';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
    <Toaster position="top-center" richColors />
      <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<ChatLayout />} />
              <Route path="/join/:roomId" element={<JoinGroup />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;