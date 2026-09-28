'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  productId: string;
  name: string;
  slug: string;
  basePrice: number;
  imageUrl: string;
  styleCategory: string;
}

interface FavoritesStore {
  favorites: FavoriteItem[];
  toggle: (item: FavoriteItem) => void;
  isFavorite: (productId: string) => boolean;
  remove: (productId: string) => void;
  removeMany: (productIds: string[]) => void;
  clear: () => void;
  count: () => number;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggle: (item) => {
        set((state) => {
          const exists = state.favorites.some((f) => f.productId === item.productId);
          if (exists) {
            return { favorites: state.favorites.filter((f) => f.productId !== item.productId) };
          }
          return { favorites: [...state.favorites, item] };
        });
      },

      isFavorite: (productId) => {
        return get().favorites.some((f) => f.productId === productId);
      },

      remove: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.productId !== productId),
        }));
      },

      removeMany: (productIds) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => !productIds.includes(f.productId)),
        }));
      },

      clear: () => set({ favorites: [] }),

      count: () => get().favorites.length,
    }),
    {
      name: 'salama-favorites',
    }
  )
);
