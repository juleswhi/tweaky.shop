'use client';
import { create } from 'zustand';

interface CartItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  collected: boolean;
}

interface CartState {
  items: CartItem[];
  fetchItems: () => Promise<void>;
  addToCart: (product: ProductToOrder) => Promise<void>;
}

export interface ProductToOrder {
    name: string,
    quantity: number,
    price: number,
    password: string,
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  fetchItems: async () => {
    const res = await fetch('/api/orders');
    const data: CartItem[] = await res.json();
    set({ items: data });
  },

  addToCart: async (product) => {
    try {
      // Call API to create a ShopOrder in the database
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        console.error('Failed to add to cart:', await res.text());
        return;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  },
}));

