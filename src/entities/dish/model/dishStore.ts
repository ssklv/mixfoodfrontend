import { create } from 'zustand';
import { apiClient } from '@/shared/api/apiClient';

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  weight?: number;
  volume?: number;
  proteins: number;
  fats: number;
  carbs: number;
  calories: number;
  imageUrl: string;
  categoryId: number;
}

interface DishStore {
  dishes: Dish[];
  isLoading: boolean;
  fetchDishes: () => Promise<void>;
  deleteDish: (id: number) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

export const useDishStore = create<DishStore>((set) => ({
  dishes: [],
  isLoading: false,

  fetchDishes: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/menu');
      set({ 
        dishes: Array.isArray(response.data) ? response.data : [], 
        isLoading: false 
      });
    } catch (error) {
      console.error("Ошибка загрузки блюд:", error);
      set({ dishes: [], isLoading: false });
    }
  },

  deleteDish: async (id) => {
    try {
      await apiClient.delete(`/menu/${id}`);
      set((state) => ({ 
        dishes: state.dishes.filter(d => d.id !== id) 
      }));
    } catch (error: any) {
      console.error("Ошибка при удалении:", error);
      alert(error.response?.data?.Error || 'Не удалось удалить блюдо');
    }
  },

  uploadImage: async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await apiClient.post('/menu/upload', formData);
  return response.data.url;
}
}));