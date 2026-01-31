import { create } from "zustand";
import { User } from "firebase/auth";
import { subscribeToAuthState } from "@/services/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => (() => void) | undefined;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  initializeAuth: () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    const unsubscribe = subscribeToAuthState((user) => {
      set({ user, isLoading: false, isInitialized: true });
    });
    return unsubscribe;
  },
}));
