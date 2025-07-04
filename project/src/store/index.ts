import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Job, Application, User } from "../types";

interface Store {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "job-portal-store", 
      partialize: (state) => ({ currentUser: state.currentUser }), 
    }
  )
);
