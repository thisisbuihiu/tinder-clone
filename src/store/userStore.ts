import { create } from "zustand";
import type { User } from "@/types";
import { getUser } from "@/services/firestore";

interface UserState {
  user: User | null;
  isLoading: boolean;
  loadUser: (uid: string) => Promise<void>;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  loadUser: async (uid: string) => {
    set({ isLoading: true });
    try {
      const user = await getUser(uid);
      set({ user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
