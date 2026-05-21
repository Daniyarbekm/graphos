import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mathDebug: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMathDebug: (enabled: boolean) => void;
  toggleMathDebug: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      mathDebug: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setMathDebug: (mathDebug) => set({ mathDebug }),
      toggleMathDebug: () => set((s) => ({ mathDebug: !s.mathDebug })),
    }),
    { name: "graphos-ui" },
  ),
);
