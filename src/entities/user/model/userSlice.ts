import { create } from 'zustand';

interface UserState {
  isAuth: boolean;
  userName: string;
  setAuth: (isAuth: boolean, token: string, name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuth: !!localStorage.getItem('accessToken'), // Проверка авторизации при загрузке
  userName: localStorage.getItem('userName') || '',
  setAuth: (isAuth, token, name) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userName', name);
    set({ isAuth, userName: name });
  },
}));