import { create } from 'zustand';
import { apiClient } from '../../../shared/api/apiClient';

export interface Address {
  id: number;
  street_house: string;
  apartment: string;
  entrance: string;
  floor: string;
  door_code: string;
}

interface UserState {
  isAuth: boolean;
  userName: string;
  userPhone: string;
  userEmail: string;
  role: 'user' | 'admin';
  isLoading: boolean;
  addresses: Address[];
  setAuth: (token: string, name: string) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (params: { name: string; phone: string; email: string }) => Promise<{ success: boolean; error?: string }>;
  fetchAddresses: () => Promise<void>;
  createAddress: (address: Omit<Address, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateAddress: (id: number, address: Omit<Address, 'id'>) => Promise<{ success: boolean; error?: string }>;
  deleteAddress: (id: number) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  isAuth: !!sessionStorage.getItem('accessToken'),
  userName: sessionStorage.getItem('userName') || '',
  userPhone: '',
  userEmail: '',
  role: 'user',
  isLoading: false,
  addresses: [],

  setAuth: (token, name) => {
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('userName', name);
    set({ isAuth: true, userName: name });
  },

  fetchProfile: async () => {
    try {
      const response = await apiClient.get('/user/me');
      const { name, phone, email, role } = response.data;
      if (name) sessionStorage.setItem('userName', name);
      set({ 
        isAuth: true, 
        userName: name, 
        userPhone: phone, 
        userEmail: email, 
        role: role || 'user' 
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        sessionStorage.removeItem('accessToken');
        set({ isAuth: false });
      }
    }
  },

  updateProfile: async (params) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.patch('/user/profile', params);
      const { name, phone, email } = response.data;
      if (name) sessionStorage.setItem('userName', name);
      set({ userName: name, userPhone: phone, userEmail: email, isLoading: false });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.Error || 'Ошибка обновления профиля' };
    }
  },

  fetchAddresses: async () => {
    try {
      const res = await apiClient.get('/user/addresses');
      set({ addresses: res.data || [] });
    } catch (e) { console.error(e); }
  },

  createAddress: async (addr) => {
    try {
      await apiClient.post('/user/address', addr);
      await get().fetchAddresses();
      return { success: true };
    } catch (e: any) { 
      return { success: false, error: e.response?.data?.Error || 'Ошибка создания' }; 
    }
  },

  updateAddress: async (id, addr) => {
    try {
      await apiClient.put('/user/address', { id, ...addr });
      await get().fetchAddresses();
      return { success: true };
    } catch (e: any) { 
      return { success: false, error: e.response?.data?.Error || 'Ошибка обновления' }; 
    }
  },

  deleteAddress: async (id) => {
    try {
      await apiClient.delete('/user/address', { 
        data: { id } 
      });
      set((state) => ({ addresses: state.addresses.filter(a => a.id !== id) }));
      return true;
    } catch (e) { 
      return false; 
    }
  },

  logout: async () => {
    try { await apiClient.post('/auth/logout'); } catch (e) {}
    sessionStorage.clear();
    set({ isAuth: false, userName: '', userPhone: '', userEmail: '', role: 'user', addresses: [] });
  }
}));