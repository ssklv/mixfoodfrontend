import { create } from 'zustand';

interface ToastData {
  title: string;
  message: string;
}

interface ToastStore {
  toast: ToastData | null;
  showToast: (title: string, message: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (title, message) => set({ toast: { title, message } }),
  hideToast: () => set({ toast: null }),
}));