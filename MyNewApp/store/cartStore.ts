import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OrderType = 'DELIVERY' | 'DINE_IN';

export interface CartItem {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  vendorId: string | null;
  vendorName: string | null;
  items: CartItem[];
  orderType: OrderType;
  
  addItem: (item: CartItem, vId: string, vName: string) => void;
  removeItem: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      vendorId: null,
      vendorName: null,
      items: [],
      orderType: 'DELIVERY',

      addItem: (item, vId, vName) => {
        const state = get();
        
        // If adding an item from a different vendor, we replace the cart
        // (Alternatively, we could throw an error or show a prompt)
        if (state.vendorId && state.vendorId !== vId) {
          set({
            vendorId: vId,
            vendorName: vName,
            items: [{ ...item, quantity: 1 }],
          });
          return;
        }

        const existingItem = state.items.find((i) => i.mealId === item.mealId);
        
        if (existingItem) {
          set({
            items: state.items.map((i) =>
              i.mealId === item.mealId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({
            vendorId: vId,
            vendorName: vName,
            items: [...state.items, { ...item, quantity: 1 }],
          });
        }
      },

      removeItem: (mealId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.mealId !== mealId);
          return {
            items: newItems,
            vendorId: newItems.length === 0 ? null : state.vendorId,
            vendorName: newItems.length === 0 ? null : state.vendorName,
          };
        });
      },

      updateQuantity: (mealId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(mealId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.mealId === mealId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], vendorId: null, vendorName: null });
      },

      setOrderType: (type) => {
        set({ orderType: type });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
