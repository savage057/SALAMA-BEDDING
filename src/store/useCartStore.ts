'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartStore } from '@/types';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.variantId === newItem.variantId
          );

          if (existingItemIndex > -1) {
            // Increment quantity if item already exists
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }

          // Otherwise add new item to cart
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.variantId !== variantId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.variantId === variantId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      totalItems: () => {
        const { items } = get();
        return items.reduce((acc, item) => acc + item.quantity, 0);
      },

      totalPrice: () => {
        const { items } = get();
        return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      },

      isProductInCart: (productId) => {
        const { items } = get();
        return items.some((item) => item.productId === productId);
      },
    }),
    {
      name: 'salama-bedding-cart', // key for localStorage
    }
  )
);
