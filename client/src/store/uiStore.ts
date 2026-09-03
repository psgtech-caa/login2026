import { create } from 'zustand';

interface UIState {
  isCompanionOpen: boolean;
  openCompanion: () => void;
  closeCompanion: () => void;
  toggleCompanion: () => void;
  
  // Backward compatibility aliases
  isMobileCompanionOpen: boolean;
  openMobileCompanion: () => void;
  closeMobileCompanion: () => void;
  toggleMobileCompanion: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCompanionOpen: false,
  openCompanion: () => set({ isCompanionOpen: true, isMobileCompanionOpen: true }),
  closeCompanion: () => set({ isCompanionOpen: false, isMobileCompanionOpen: false }),
  toggleCompanion: () => set((state) => ({ 
    isCompanionOpen: !state.isCompanionOpen,
    isMobileCompanionOpen: !state.isCompanionOpen
  })),

  isMobileCompanionOpen: false,
  openMobileCompanion: () => set({ isCompanionOpen: true, isMobileCompanionOpen: true }),
  closeMobileCompanion: () => set({ isCompanionOpen: false, isMobileCompanionOpen: false }),
  toggleMobileCompanion: () => set((state) => ({ 
    isCompanionOpen: !state.isCompanionOpen,
    isMobileCompanionOpen: !state.isCompanionOpen 
  })),
}));
