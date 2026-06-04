import { create } from 'zustand';
import { apiClient } from '@/shared/api/apiClient';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface Address {
  id: number;
  userId: number;
  street_house: string;
  apartment: string;
  entrance: string;
  floor: string;
  door_code: string;
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
  address?: Address; // ← добавлено для администратора
}

export interface CreateOrderPayload {
  addressId: number;
  deliveryTime: string;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
}

interface OrderStore {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  fetchAdminOrders: () => Promise<void>;
  createOrder: (payload: CreateOrderPayload) => Promise<boolean>;
  updateOrderStatus: (orderId: number, status: string) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    try {
      set({ loading: true });
      const res = await apiClient.get('/orders');
      set({ orders: res.data || [], loading: false });
    } catch (e) {
      console.error('fetchOrders error:', e);
      set({ loading: false });
    }
  },

  fetchAdminOrders: async () => {
    try {
      set({ loading: true });
      const res = await apiClient.get('/admin/orders');
      set({ orders: res.data || [], loading: false });
    } catch (e) {
      console.error('fetchAdminOrders error:', e);
      set({ loading: false });
    }
  },

  createOrder: async (payload) => {
    try {
      await apiClient.post('/orders', payload);
      await get().fetchOrders();
      return true;
    } catch (e) {
      console.error('createOrder error:', e);
      return false;
    }
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    }));
  },
}));