import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CookieConsentStatus = 'pending' | 'accepted' | 'rejected';

interface CookieConsentStore {
  status: CookieConsentStatus;
  accept: () => void;
  reject: () => void;
  reset: () => void;
}

export const useCookieConsentStore = create<CookieConsentStore>()(
  persist(
    (set) => ({
      status: 'pending',
      accept: () => set({ status: 'accepted' }),
      reject: () => set({ status: 'rejected' }),
      reset: () => set({ status: 'pending' }),
    }),
    {
      name: 'cookie-consent',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
