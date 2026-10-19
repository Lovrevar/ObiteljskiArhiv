import { create } from 'zustand';

interface WaitlistStore {
  isOpen: boolean;
  source: string;
  open: (source: string) => void;
  close: () => void;
}

export const useWaitlistStore = create<WaitlistStore>((set) => ({
  isOpen: false,
  source: 'unknown',
  open: (source) => set({ isOpen: true, source }),
  close: () => set({ isOpen: false }),
}));
