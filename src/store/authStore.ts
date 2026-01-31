import { create } from "zustand";
import { User } from "firebase/auth";
import { subscribeToAuthState } from "@/services/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  initialize: () => {
    if (useAuthStore.getState().isInitialized) return;
    set({ isInitialized: true });
    subscribeToAuthState((user) => {
      set({ user, isLoading: false });
    });
  },
}));
