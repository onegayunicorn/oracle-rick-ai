import { create } from "zustand";

export const useUIStore = create((set) => ({
  mobileMenuOpen: false,
  activePanel: null,

  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  openPanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null }),
}));
