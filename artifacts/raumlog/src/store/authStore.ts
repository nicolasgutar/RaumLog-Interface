import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AccountType = 'Anfitrión' | 'Cliente';

export interface User {
  uid: string;
  email: string;
  name?: string;
  phone?: string;
  role: AccountType;
  isOnboardingComplete: boolean;
  isEmailVerified: boolean;
  isUserVerified: boolean;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  idToken: string | null;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User | null, idToken: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      idToken: null,
      isLoading: false,
      error: null,
      setAuth: (user, idToken) => set({ user, idToken, isLoading: false, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      logout: () => set({ user: null, idToken: null }),
    }),
    {
      name: 'raumlog-auth-storage',
    }
  )
);
