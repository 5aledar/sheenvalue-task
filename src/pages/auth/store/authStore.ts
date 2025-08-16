import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logoutHandler: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'), // load from localStorage on init
  setToken: (token) => {
    localStorage.setItem('token', token || '');
    set({ token });
  },
  logoutHandler: () => {
    localStorage.removeItem('token');
    set({ token: null });
  }
}));
