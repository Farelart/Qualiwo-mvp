import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemData {
  id: string;
  type: "product" | "food" | "accommodation";
  name: string;
  price: number; // Amount in smallest currency unit (e.g., cents, FCFA)
  currency: string;
  image: string;
  source: string;
}

export interface CartItem extends CartItemData {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  totalPrice: number;
  addItem: (itemData: CartItemData, quantity?: number) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  updateTotalPrice: () => void;
}

export const useCartStoreNew = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      
      addItem: (itemData: CartItemData, quantity: number = 1) => {
        const existingItem = get().items.find(item => item.id === itemData.id);
        
        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.id === itemData.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }));
        } else {
          set(state => ({
            items: [...state.items, { ...itemData, quantity }]
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
          return sum + (item.price * item.quantity);
        }, 0);
        set({ totalPrice: total });
      }
    }),
    {
      name: 'cart-storage-new',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.updateTotalPrice();
        }
      }
    }
  )
);

