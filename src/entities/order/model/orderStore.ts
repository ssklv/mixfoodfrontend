import { create } from 'zustand';
import { apiClient } from '@/shared/api/apiClient';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  addressId: number;
  totalPrice: number;
  status: string;
  deliveryTime: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrderStore {
  orders: Order[];
  loading: boolean;

  fetchOrders: () => Promise<void>;
  createOrder: (payload: any) => Promise<boolean>;
  updateOrderStatus: (orderId: number, status: string) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    try {
      set({ loading: true });

      const res = await apiClient.get('/orders');

      set({
        orders: res.data || [],
        loading: false,
      });
    } catch (e) {
      console.error(e);
      set({ loading: false });
    }
  },

  createOrder: async (payload) => {
    try {
      await apiClient.post('/orders', payload);

      await get().fetchOrders();

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, status }
          : order
      ),
    }));
  },
}));