import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';
import { db, CartItem } from './database';
import { useAuthStore } from './auth-store';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (productId: string, quantity: number, price: number, name?: string, size?: string, color?: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (productId: string, quantity: number, price: number, name?: string, size?: string, color?: string) => {
        set({ isLoading: true });
        try {
          const { user } = useAuthStore.getState();
          if (!user) {
            console.error('User not authenticated');
            set({ isLoading: false });
            return;
          }

          let cart = await db.getCartForUser(user.id);
          if (!cart) {
            const cartId = await db.createCart(user.id);
            cart = { id: cartId, user_id: user.id, created_at: Date.now() };
          }

          const itemId = await db.addCartItem({
            cart_id: cart.id,
