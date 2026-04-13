import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  activeModal: string | null;
  openSidebar: () => void;
  closeSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isSidebarOpen: false,
  activeModal: null,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
