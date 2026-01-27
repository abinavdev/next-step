import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlanType = 'free' | 'project-assistance' | 'mentor-assistance';

export interface Subscription {
  planId: PlanType;
  planName: string;
  price: number;
  features: string[];
  startDate: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription?: Subscription;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setSubscription: (subscription: Subscription) => void;
  getSubscription: () => Subscription | undefined;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock authentication
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          if (!email || !password) {
            throw new Error('Email and password are required');
          }

          const user: User = {
            id: crypto.randomUUID(),
            name: email.split('@')[0],
            email,
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock registration
          await new Promise((resolve) => setTimeout(resolve, 500));

          if (!name || !email || !password) {
            throw new Error('All fields are required');
          }

          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
          }

          const user: User = {
            id: crypto.randomUUID(),
            name,
            email,
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setSubscription: (subscription: Subscription) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              subscription,
            },
          };
        });
      },

      getSubscription: () => {
        return get().user?.subscription;
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'nextstep-auth-storage',
    }
  )
);
