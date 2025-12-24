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
      },

      logout: async () => {
        set({ user: null, isAuthenticated: false });
        await storage.removeItem('auth_token');
        await storage.removeItem('user_id');
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          if (!PasswordUtils.isValidEmail(email)) {
            set({ isLoading: false });
            return false;
          }

          const passwordValidation = PasswordUtils.validatePassword(password);
          if (!passwordValidation.isValid) {
            console.error('Password validation failed:', passwordValidation.errors);
            set({ isLoading: false });
            return false;
          }

          const existingUser = await db.getUserByEmail(email);
          if (existingUser) {
            set({ isLoading: false });
            return false; // User already exists
          }

          const userId = PasswordUtils.generateUserId();
          const hashedPassword = await PasswordUtils.hashPassword(password);
          
          const user: Omit<User, 'created_at'> = {
            id: userId,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password_hash: hashedPassword,
          };

          await db.createUser(user);
          const newUser = await db.getUserByEmail(email);
          if (newUser) {
            const sessionToken = PasswordUtils.generateSessionToken();
            set({ user: newUser, isAuthenticated: true, isLoading: false });
            await storage.setItem('auth_token', sessionToken);
            await storage.setItem('user_id', newUser.id);
            return true;
