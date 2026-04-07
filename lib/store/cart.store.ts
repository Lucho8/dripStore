import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);

        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + item.quantity, i.stock),
                  }
                : i,
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: "drip-cart",
    },
  ),
);
