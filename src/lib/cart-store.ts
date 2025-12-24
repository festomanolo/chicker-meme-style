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
            product_id: productId,
            quantity,
            price,
            name,
            size,
            color,
          });

          const newItem: CartItem = {
            id: itemId,
            cart_id: cart.id,
            product_id: productId,
            quantity,
            price,
            name,
            size,
            color,
          };

          set((state) => ({
            items: [...state.items, newItem],
            isLoading: false,
          }));
        } catch (error) {
          console.error('Add item error:', error);
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId: string) => {
        set({ isLoading: true });
        try {
          await db.removeCartItem(itemId);
          set((state) => ({
            items: state.items.filter(item => item.id !== itemId),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Remove item error:', error);
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        set({ isLoading: true });
        try {
          if (quantity <= 0) {
            await db.removeCartItem(itemId);
            set((state) => ({
              items: state.items.filter(item => item.id !== itemId),
              isLoading: false,
            }));
          } else {
            await db.updateCartItemQuantity(itemId, quantity);
            set((state) => ({
              items: state.items.map(item =>
                item.id === itemId ? { ...item, quantity } : item
              ),
              isLoading: false,
            }));
          }
        } catch (error) {
          console.error('Update quantity error:', error);
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          const { user } = useAuthStore.getState();
          if (user) {
            const cart = await db.getCartForUser(user.id);
            if (cart) {
              await db.clearCart(cart.id);
            }
          }
          set({ items: [], isLoading: false });
        } catch (error) {
          console.error('Clear cart error:', error);
          set({ isLoading: false });
        }
      },

      loadCart: async () => {
        set({ isLoading: true });
        try {
          const { user } = useAuthStore.getState();
          if (user) {
            const cart = await db.getCartForUser(user.id);
            if (cart) {
              const items = await db.getCartItems(cart.id);
              set({ items, isLoading: false });
            } else {
              set({ items: [], isLoading: false });
            }
          } else {
            set({ items: [], isLoading: false });
          }
        } catch (error) {
          console.error('Load cart error:', error);
          set({ items: [], isLoading: false });
        }
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);





