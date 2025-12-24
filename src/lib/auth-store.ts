import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';
import { db, User } from './database';
import { PasswordUtils } from './crypto';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          if (!PasswordUtils.isValidEmail(email)) {
            set({ isLoading: false });
            return false;
          }

          const user = await db.getUserByEmail(email);
          if (user && await PasswordUtils.verifyPassword(password, user.password_hash)) {
            const sessionToken = PasswordUtils.generateSessionToken();
            set({ user, isAuthenticated: true, isLoading: false });
            await storage.setItem('auth_token', sessionToken);
            await storage.setItem('user_id', user.id);
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
