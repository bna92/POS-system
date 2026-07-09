import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppUser } from "../types/user.types";

interface AuthState {
  token: string | null;
  user: AppUser | null;
  setAuth: (token: string, user: AppUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "pos-auth" }
  )
);
