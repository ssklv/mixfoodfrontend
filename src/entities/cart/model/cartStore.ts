import { create } from 'zustand';

interface CartItem {
  id: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addToCart: (id) => set((state) => {
    const existingItem = state.items.find(item => item.id === id);
    if (existingItem) {
      return { 
        items: state.items.map(item => 
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ) 
      };
    }
    return { items: [...state.items, { id, quantity: 1 }] };
  }),

  removeFromCart: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  updateQuantity: (id, quantity) => set((state) => {

    if (quantity < 1) {
      return { items: state.items.filter(item => item.id !== id) };
    }
    return {
      items: state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    };
  }),

  clearCart: () => set({ items: [] }),
}));