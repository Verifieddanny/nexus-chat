import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  login: (user: User, token: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>; 
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        try {
          if (!get().token) return;

          const response = await api.get('/auth/me'); 
          set({ user: response.data.data });
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          get().logout();
        }
      },
    }),
    {
      name: 'chat-auth-storage',
    }
  )
);
