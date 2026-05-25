// ============================================================
// Auth Store — Zustand state management with localStorage
// ============================================================

import { create } from 'zustand';
import type { User } from '@/types';
import { authApi } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  setUser: (user: User) => void;
  loadUser: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        set({ token, isAuthenticated: true });
        // Load user profile in background
        get().loadUser();
      } else {
        set({ isLoading: false });
      }
    }
  },

  login: async (email: string, password: string) => {
    const tokenData = await authApi.login(email, password);
    const token = tokenData.access_token;

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }

    set({ token, isAuthenticated: true });

    const user = await authApi.getMe();
    set({ user, isLoading: false });
    return user;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user: User) => {
    set({ user, isLoading: false });
  },

  loadUser: async () => {
    try {
      const user = await authApi.getMe();
      set({ user, isLoading: false });
    } catch {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
