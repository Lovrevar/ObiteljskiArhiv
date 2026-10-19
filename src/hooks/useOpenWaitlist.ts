import { useWaitlistStore } from '@/stores/waitlistStore';

export function useOpenWaitlist() {
  return useWaitlistStore((state) => state.open);
}
