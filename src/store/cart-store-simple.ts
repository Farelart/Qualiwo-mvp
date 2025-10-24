import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/ai/tools';

export interface CartItem {
  product: Product;
  quantity: number;
  id: string; 
}

interface CartStore {
  items: CartItem[];
  totalPrice: number;
  addItem: (product: Product, quantity: number) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  updateTotalPrice: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      
      addItem: (product: Product, quantity: number) => {
        const id = product.name; // Using name as unique identifier
        const existingItem = get().items.find(item => item.id === id);
        
        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.id === id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }));
        } else {
          set(state => ({
            items: [...state.items, { product, quantity, id }]
          }));
        }
        get().updateTotalPrice();
      },
      
      incrementItem: (id: string) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }));
        get().updateTotalPrice();
      },
      
      decrementItem: (id: string) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id && item.quantity > 0
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ).filter(item => item.quantity > 0)
        }));
        get().updateTotalPrice();
      },
      
      removeItem: (id: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }));
        get().updateTotalPrice();
      },
      
      clearCart: () => {
        set({ items: [], totalPrice: 0 });
      },
      
      getItemQuantity: (id: string) => {
        const item = get().items.find(item => item.id === id);
        return item ? item.quantity : 0;
      },
      
      updateTotalPrice: () => {
        const total = get().items.reduce((sum, item) => {
          const price = parseFloat(item.product.priceEuro);
          return sum + (price * item.quantity);
        }, 0);
        set({ totalPrice: total });
      }
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.updateTotalPrice();
        }
      }
    }
  )
);
