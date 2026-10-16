import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';
import { db, CartItem } from './database';
import { useAuthStore } from './auth-store';
import { products } from '@/data/products';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (
    productId: string,
    quantity: number,
    price: number,
    name?: string,
    size?: string,
    color?: string,
    image?: string,
    customDesign?: CartItem['customDesign']
  ) => Promise<void>;
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

      addItem: async (
        productId: string,
        quantity: number,
        price: number,
        name?: string,
        size = 'L',
        color = 'White',
        image?: string,
        customDesign?: CartItem['customDesign']
      ) => {
        set({ isLoading: true });
        try {
          const { user } = useAuthStore.getState();
          const ownerId = user?.id || 'guest';

          let cart = await db.getCartForUser(ownerId);
          if (!cart) {
            const cartId = await db.createCart(ownerId);
            cart = { id: cartId, user_id: ownerId, created_at: Date.now() };
          }

          // Check if an identical product + size + color (non-custom) already exists in cart
          const existing = !customDesign
            ? get().items.find(
                (i) =>
                  i.product_id === productId &&
                  (i.size || 'L') === size &&
                  (i.color || 'White') === color &&
                  !i.customDesign
              )
            : undefined;

          if (existing) {
            const nextQty = existing.quantity + quantity;
            await db.updateCartItemQuantity(existing.id, nextQty);
            set((state) => ({
              items: state.items.map((item) =>
                item.id === existing.id ? { ...item, quantity: nextQty } : item
              ),
              isLoading: false,
            }));
            return;
          }

          const catalogProduct = products.find((p) => p.id === productId);
          const resolvedName = name || catalogProduct?.name || 'Custom Meme Apparel';
          const resolvedImage = image || catalogProduct?.image || '/placeholder.svg';

          const itemId = await db.addCartItem({
            cart_id: cart.id,
            product_id: productId,
            quantity,
            price,
            originalPrice: catalogProduct?.originalPrice,
            name: resolvedName,
            image: resolvedImage,
            size,
            color,
            inStock: true,
            customDesign,
          });

          const newItem: CartItem = {
            id: itemId,
            cart_id: cart.id,
            product_id: productId,
            quantity,
            price,
            originalPrice: catalogProduct?.originalPrice,
            name: resolvedName,
            image: resolvedImage,
            size,
            color,
            inStock: true,
            customDesign,
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
            items: state.items.filter((item) => item.id !== itemId),
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
              items: state.items.filter((item) => item.id !== itemId),
              isLoading: false,
            }));
          } else {
            await db.updateCartItemQuantity(itemId, quantity);
            set((state) => ({
              items: state.items.map((item) =>
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
          const ownerId = user?.id || 'guest';
          const cart = await db.getCartForUser(ownerId);
          if (cart) {
            await db.clearCart(cart.id);
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
          const ownerId = user?.id || 'guest';
          const cart = await db.getCartForUser(ownerId);
          if (cart) {
            const dbItems = await db.getCartItems(cart.id);
            if (dbItems.length > 0) {
              set({ items: dbItems, isLoading: false });
              return;
            }
          }
          set({ isLoading: false });
        } catch (error) {
          console.error('Load cart error:', error);
          set({ isLoading: false });
        }
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
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
